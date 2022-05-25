import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Query,
} from '@nestjs/common';
import { EmailService } from '../email/email.service';
import { TokenService } from '../token/token.service';
import { TenantService } from './tenant.service';
import { UserService } from '../user/user.service';
import { SNUser } from '../user/user.model';
import { UserController } from '../user/user.controller';
import { Tenant } from './tenant.decorator';
import { CryptService } from '../crypt/crypt.service';
import { ConfigService } from '../shared/config.service';
import { emails } from '../message/emails';
import { ServiceData } from '@butopen/ssonext-model';

@Controller('tenant')
export class TenantController {
  constructor(
    private emailService: EmailService,
    private tokenService: TokenService,
    private tenantService: TenantService,
    private userController: UserController,
    private userService: UserService,
    private configService: ConfigService,
    private crypt: CryptService,
  ) {}

  @Post('service')
  async updateService(@Body() service: ServiceData, @Tenant() tenant: string) {
    const result = await this.tenantService.updateService(tenant, service);
    return { updated: true };
  }

  @Get('exists')
  async exists(@Query('service') service: string) {
    const exists = await this.tenantService.exists(service);
    return {
      service,
      exists,
    };
  }

  @Get('confirm')
  async confirm(@Query('token') token: string) {
    const tokenData = this.tokenService.verify<{
      email: string;
      scope: string;
    }>(token);
    const email = tokenData.email;
    await this.checkTenant(email);
    const tenantId = await this.tenantService.create(email);
    const password = this.crypt.generateRandomPassword();
    const postgresPassword = this.crypt.generateRandomPassword();
    await this.tenantService.createTenantPostgresUser({
      tenant: tenantId,
      password: postgresPassword,
    });
    const user = {
      email,
      tenant: tenantId,
      password,
      roles: ['ADMIN', 'EMAIL_CONFIRMED', 'TENANT_OWNER'],
      info: {},
    } as SNUser;
    await this.userService.createUser(user);
    const result = await this.userController.login(
      { email, password },
      tenantId,
    );
    const { subject, body } = emails.credentials(
      email,
      password,
      tenantId,
      postgresPassword,
      this.configService.backend_url,
    );
    await this.emailService.send(email, subject, body);
    return { token: result.token };
  }

  @Get('subscribe')
  async subscribe(@Query('email') email: string) {
    await this.checkTenant(email);
    const token = this.tokenService.generate({
      email,
      scope: 'tenant-confirm',
    });
    const { subject, body } = emails.welcome(
      token,
      this.configService.backend_url,
    );
    await this.emailService.send(email, subject, body);
    return { email_sent: true };
  }

  private async checkTenant(email: string) {
    const found = await this.tenantService.findTenantByEmail(email);
    if (found.length > 0) {
      const t = found[0];
      throw new HttpException(
        {
          status: HttpStatus.CONFLICT,
          error: true,
          code: 'email-exists',
          tenant: t.tenantid,
        },
        HttpStatus.CONFLICT,
      );
    }
  }
}
