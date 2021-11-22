import {Injectable} from "@nestjs/common";
import {EmailConfiguration} from "../email/email.service";
import {DBConfig} from "./postgres-db.service";

export interface Config {
    db: DBConfig
    email:EmailConfiguration
    master_password: string
    backend_url: string
}

@Injectable()
export class ConfigService implements Config {
    db: DBConfig
    email:EmailConfiguration
    master_password: string
    backend_url: string
}
