import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserService } from './user/user.service';
import { loadMessages } from './config.function';
import { CryptService } from './crypt/crypt.service';
import { UserController } from './user/user.controller';
import { TokenService } from './token/token.service';
import { globalConfig } from './shared/config.service';
import { EmailService } from './email/email.service';
import { MessageService } from './message/message.service';
import { UserAPIController } from './user/user-api.controller';
import { SharedModule } from './shared/shared.module';
import { TenantController } from './tenant/tenant.controller';
import { TenantService } from './tenant/tenant.service';
import { InjectorService } from './shared/find-injected-service.function';

const messages = loadMessages();

@Module({
  imports: [SharedModule],
  controllers: [
    AppController,
    UserController,
    UserAPIController,
    TenantController,
  ],
  providers: [
    AppService,
    { provide: MessageService, useValue: new MessageService(messages) },
    { provide: EmailService, useValue: new EmailService(globalConfig.email) },
    {
      provide: CryptService,
      useValue: new CryptService(globalConfig.master_password),
    },
    {
      provide: TokenService,
      useValue: new TokenService(globalConfig.master_password),
    },
    TenantService,
    UserService,
    UserController,
    InjectorService,
  ],
})
export class AppModule {}
