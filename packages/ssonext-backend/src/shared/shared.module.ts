import { Module } from '@nestjs/common';
import { ConfigService, globalConfig } from './config.service';
import { DB, PostgresDbService } from './postgres-db.service';

@Module({
  providers: [
    { provide: DB, useValue: new PostgresDbService(globalConfig.db) },
    ConfigService,
  ],
  exports: [DB, ConfigService],
})
export class SharedModule {}
