import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {UserService} from './user/user.service';
import {loadConfig, loadMessages} from "./config.function";
import {CryptService} from './crypt/crypt.service';
import {UserController} from './user/user.controller';
import {TokenService} from './token/token.service';
import { TenantModule } from './tenant/tenant.module';
import {Config, ConfigService} from "./shared/config.service";
import { EmailService } from './email/email.service';
import { MessageService } from './message/message.service';
import {UserAPIController} from "./user/user-api.controller";
import { SharedModule } from './shared/shared.module';


const config:Config = loadConfig()
console.log("config: ", config)

const messages = loadMessages()



@Module({
    imports: [TenantModule, SharedModule],
    controllers: [AppController, UserController, UserAPIController],
    providers: [AppService, UserService,
        {provide: MessageService, useValue: new MessageService(messages)},
        {provide: EmailService, useValue: new EmailService(config.email)},
        {provide: CryptService, useValue: new CryptService(config.master_password)},
        {provide: TokenService, useValue: new TokenService(config.master_password)}],
})
export class AppModule {


}
