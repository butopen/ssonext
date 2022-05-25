import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Query,
  Redirect,
  Headers,
  Injectable,
} from '@nestjs/common';
import { UserService } from './user.service';
import { SNLoginUser, SNUserWithoutId } from './user.model';
import { TokenService } from '../token/token.service';
import { TenantService } from '../tenant/tenant.service';
import { ConfigService } from '../shared/config.service';
import { EmailService } from '../email/email.service';
import { MessageService } from '../message/message.service';
import { CryptService } from '../crypt/crypt.service';
import { Tenant } from '../tenant/tenant.decorator';
import { EmailInformation } from '../shared/ssonext.model';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
    private readonly cryptService: CryptService,
    private readonly tenantService: TenantService,
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
    private readonly messageService: MessageService,
  ) {}

  @Post('login')
  async login(@Body() user: SNLoginUser, @Query('tenant') tenantCode: string) {
    const tenant = await this.tenantService.tenantIdFromCode(tenantCode);
    const found = await this.userService.findUser(
      user.email.trim().toLowerCase(),
      user.password.trim(),
      tenant,
    );
    const tenantConfig = await this.tenantService.configuration(tenant);
    const informationFields = tenantConfig.userTokenFields;
    if (found.length > 0) {
      let information = {};
      if (informationFields == '*') information = found[0].info;
      else if (informationFields && informationFields.length > 0) {
        const fields = informationFields.split(',');
        for (const f of fields) information[f] = found[0].info[f];
      }
      const token = this.tokenService.generate({
        id: this.cryptService.encode(found[0].userid),
        email: user.email,
        roles: found[0].roles,
        tenant,
        information,
      });
      return { token, destinationUrl: tenantConfig.destinationUrl };
    } else throw new HttpException('User not found', HttpStatus.NOT_FOUND);
  }

  @Post('request-registration')
  async register(
    @Body()
    user: SNUserWithoutId & EmailInformation,
    @Query('tenant') t: string,
  ) {
    const tenantCode = this.verifyTenant(t, user);
    const tenant = await this.tenantService.tenantIdFromCode(tenantCode);
    const tenantConfig = await this.tenantService.configuration(tenantCode);
    const info = { ...user };
    delete info.email;
    delete info.password;
    delete info.tenant;
    delete info.created;
    delete info.roles;
    const nonRegisteredUser: SNUserWithoutId = {
      info,
      email: user.email,
      roles: ['UNCONFIRMED_EMAIL'],
      password: user.password,
      tenant,
      created: new Date(),
    };
    const result = await this.userService.createUser(nonRegisteredUser);
    const token = this.tokenService.generate({
      user,
      userid: result[0].userid,
      tenant: tenantCode,
    });
    console.log('token: ', token);
    const link =
      this.configService.backend_url + '/api/user/register?token=' + token;
    await this.emailService.send(
      user.email,
      this.messageService.get(user.emailSubject || 'email.welcome-subject'),
      `
        ${this.messageService.get(user.emailBody || 'email.welcome-body', {
          name: (user.info as { name: string })?.name ?? 'user',
        })}
        
        ${user.emailBody?.indexOf('$link') == -1 ? '' : link}
        
        `,
    );
    return { ok: true };
  }

  @Get('register')
  async confirmRegistration(@Query('token') token: string) {
    try {
      let data = this.tokenService.verify(token) as unknown as {
        user: SNUserWithoutId;
        tenant: string;
        roles: string[];
        userid: number;
      };
      console.log('data: ', data);
      const user = data.user;
      user.email = user.email.trim().toLowerCase();
      user.password = user.password.trim();
      let tenantId = await this.tenantService.tenantIdFromCode(data.tenant);
      const foundUsers = await this.userService.findUserById(
        data.userid,
        tenantId,
      );
      if (foundUsers.length == 0)
        throw new HttpException(`Cannot find this user: ${token}`, 404);
      await this.userService.updateUserRoles(
        data.userid,
        ['EMAIL_CONFIRMED', 'USER'],
        tenantId,
      );
      console.log('user saved into db');
      const loginToken = this.tokenService.generate({
        id: this.cryptService.encode(data.userid),
        email: user.email,
        roles: data.roles,
        tenant: data.tenant,
        information: foundUsers[0].info,
      });
      return {
        url: `${this.configService.backend_url}/app/dashboard?token=${loginToken}`,
      };
    } catch {
      return {
        url: this.configService.backend_url + '/app/error?error=' + token,
      };
    }
  }

  @Post('forgot-password')
  async forgotPassword(
    @Body()
    {
      email,
      tenant,
      emailSubject,
      emailBody,
    }: { email: string; tenant: string } & EmailInformation,
  ) {
    const tconf = await this.tenantService.configuration(tenant);
    const token = this.tokenService.generate({ email, tenant });
    const link =
      this.configService.backend_url +
      '/app/auth/password-reset?reset=' +
      token;
    await this.emailService.send(
      email.trim().toLowerCase(),
      this.messageService.get(emailSubject || 'password-forgot.email-subject', {
        service: tconf.code,
      }),
      this.messageService.get(emailBody || 'password-forgot.email-body', {
        service: tconf.code,
        link,
      }),
    );
    return { ok: true };
  }

  @Post('reset-password')
  async resetPassword(@Body() resetData: { token: string; password: string }) {
    const token = this.tokenService.verify(resetData.token);
    const tenant = await this.tenantService.tenantIdFromCode(token.tenant);
    let user = await this.userService.findUserByEmail(
      token.email.trim().toLowerCase(),
      tenant,
    );
    await this.userService.resetUserPassword(
      user[0].userid,
      resetData.password.trim(),
      tenant,
    );
    return { ok: true };
  }

  @Get('email-exists')
  async checkEmail(
    @Query('email') email: string,
    @Query('tenant') tenant: string,
  ) {
    const tenantId = await this.tenantService.tenantIdFromCode(tenant);
    let exists = await this.userService.userWithEmailExists(
      email.trim().toLowerCase(),
      tenantId,
    );
    return { exists };
  }

  private verifyTenant(t: string, user: SNUserWithoutId) {
    const tenant = user?.tenant ?? t ?? '1';
    return tenant;
  }
}
