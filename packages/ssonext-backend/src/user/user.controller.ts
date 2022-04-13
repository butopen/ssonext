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
  async login(@Body() user: SNLoginUser, @Query('tenant') tenant: string) {
    const found = await this.userService.findUser(
      user.email.trim().toLowerCase(),
      user.password.trim(),
      tenant,
    );
    const tenantConfig = await this.tenantService.configuration(tenant);
    const informationFields = tenantConfig.informationFieldsInToken;
    if (found.length > 0) {
      let information = {};
      if (informationFields == '*') information = found[0].info;
      else if (informationFields.length > 0) {
        const fields = informationFields.split(',');
        for (const f of fields) information[f] = found[0].info[f];
      }
      const token = this.tokenService.generate({
        id: this.cryptService.encode(found[0].userid),
        email: user.email,
        roles: found[0].roles,
        information,
      });
      return { token };
    } else throw new HttpException('User not found', HttpStatus.NOT_FOUND);
  }

  @Post('request-registration')
  async register(@Body() user: SNUserWithoutId, @Query('tenant') t: string) {
    const tenant = this.verifyTenant(t, user);
    const tenantConfig = await this.tenantService.configuration(tenant);
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
      tenant,
    });
    console.log('token: ', token);
    const link =
      this.configService.backend_url + '/api/user/register?token=' + token;
    await this.emailService.send(
      user.email,
      this.messageService.get('email.welcome-subject'),
      `
        
        ${this.messageService.get('email.welcome-body')}
        
        ${link}
        
        `,
    );
    return { ok: true };
  }

  @Redirect('https://ssonext.com/error', 302)
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
      const foundUsers = await this.userService.findUserById(
        data.userid,
        data.tenant,
      );
      if (foundUsers.length == 0)
        throw new HttpException(`Cannot find this user: ${token}`, 404);
      await this.userService.updateUserRoles(
        data.userid,
        ['EMAIL_CONFIRMED', 'USER'],
        data.tenant,
      );
      console.log('user saved into db');
      return {
        url:
          this.configService.backend_url +
          '/pages/registration-welcome?registered=' +
          token,
      };
    } catch {
      return {
        url:
          this.configService.backend_url +
          '/pages/registration-welcome?error=' +
          token,
      };
    }
  }

  @Get('forgot-password')
  async forgotPassword(
    @Query('email') email: string,
    @Query('tenant') tenant: string,
  ) {
    const tconf = await this.tenantService.configuration(tenant);
    const token = this.tokenService.generate({ email, tenant });
    const link =
      this.configService.backend_url +
      '/app/auth/password-reset?reset=' +
      token;
    await this.emailService.send(
      email.trim().toLowerCase(),
      this.messageService.get('password-forgot.email-subject', {
        service: tconf.serviceName,
      }),
      this.messageService.get('password-forgot.email-body', {
        service: tconf.serviceName,
        link,
      }),
    );
    return { ok: true };
  }

  @Post('reset-password')
  async resetPassword(resetData: { token: string; password: string }) {
    const token = this.tokenService.verify(resetData.token);
    let user = await this.userService.findUserByEmail(
      token.email.trim().toLowerCase(),
      token.tenant,
    );
    await this.userService.resetUserPassword(
      user[0].userid,
      resetData.password.trim(),
      token.tenant,
    );
    return { ok: true };
  }

  @Get('email-exists')
  async checkEmail(
    @Query('email') email: string,
    @Headers('tenant') tenant: string,
  ) {
    const t = tenant || '1';
    let exists = await this.userService.userWithEmailExists(
      email.trim().toLowerCase(),
      t,
    );
    return { exists };
  }

  private verifyTenant(t: string, user: SNUserWithoutId) {
    const tenant = user?.tenant ?? t ?? '1';
    return tenant;
  }
}
