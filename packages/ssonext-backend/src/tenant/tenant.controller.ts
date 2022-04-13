import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Query
} from '@nestjs/common';
import { EmailService } from '../email/email.service';
import { TokenService } from '../token/token.service';
import { TenantService } from './tenant.service';
import { ServiceData, TenantData } from '../shared/ssonext.model';
import { UserService } from '../user/user.service';
import { SNUser } from '../user/user.model';
import { UserController } from '../user/user.controller';
import { Tenant } from './tenant.decorator';
import { CryptService } from '../crypt/crypt.service';
import { ConfigService } from '../shared/config.service';

@Controller('tenant')
export class TenantController {
  constructor(
    private emailService: EmailService,
    private tokenService: TokenService,
    private tenantService: TenantService,
    private userController: UserController,
    private userService: UserService,
    private configService: ConfigService,
    private crypt: CryptService
  ) {
  }

  @Post('service')
  async updateService(@Body() service: ServiceData, @Tenant() tenant: string) {
    const result = await this.tenantService.updateService(tenant, service);
    return { updated: true };
  }

  @Get('confirm')
  async confirm(@Query('token') token: string) {
    const tokenData = this.tokenService.verify<{
      email: string;
      scope: string;
    }>(token);
    const email = tokenData.email;
    const tenantId = await this.tenantService.create(email);
    const password = this.crypt.generateRandomPassword();
    const postgresPassword = this.crypt.generateRandomPassword();
    await this.tenantService.createTenantPostgresUser({
      tenant: tenantId,
      password: postgresPassword
    });
    const user = {
      email,
      tenant: tenantId,
      password,
      roles: ['ADMIN', 'EMAIL_CONFIRMED', 'TENANT_OWNER'],
      info: {}
    } as SNUser;
    await this.userService.createUser(user);
    const result = await this.userController.login(
      { email, password },
      tenantId
    );
    const passwordToken = this.tokenService.generate({
      password,
      postgresPassword
    });
    return { data: passwordToken, token: result.token };
  }

  @Get('subscribe')
  async subscribe(@Query('email') email: string) {
    const found = await this.tenantService.findTenantByEmail(email);
    if (found.length > 0) {
      const t = found[0];
      throw new HttpException(
        {
          status: HttpStatus.CONFLICT,
          error: true,
          code: 'email-exists',
          tenant: t.tenantid
        },
        HttpStatus.CONFLICT
      );
    }
    const token = this.tokenService.generate({
      email,
      scope: 'tenant-confirm'
    });
    await this.emailService.send(
      email,
      'SSONext: Welcome - confirm your email to start',
      `

<h1>Welcome to SSONext</h1>
<p>To start managing your users, please confirm your email:</p>

<a href='${this.configService.backend_url}/tenant/confirm?token=${token}' 
    style='text-decoration:none;display:inline-block;color:#ffffff;background-color:#00cf80;
        border-radius:4px;width:auto;padding:12px;margin:15px;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;
        text-align:center;text-shadow: 0 0 1px #004609;font-weight: 700;' 
    target='_blank'>
    CONFIRM EMAIL
</a>

<p>or use the following link: ${this.configService.backend_url}/tenant/confirm?token=${token}</p>

<p>Enjoy managing users with easy.</p>


<p>Sincerely, <br>The SSONext team</p>
      
      `
    );
    return { email_sent: true };
  }
}
