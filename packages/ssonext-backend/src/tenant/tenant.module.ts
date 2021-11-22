import { Module } from '@nestjs/common';
import { TenantService } from './tenant.service';
import {SharedModule} from "../shared/shared.module";

@Module({
  imports: [SharedModule],
  controllers: [],
  providers: [TenantService],
  exports: [TenantService]
})
export class TenantModule {}
