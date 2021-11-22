import {Injectable} from '@nestjs/common';
import {defaultTenantConfig, TenantConfiguration} from "./tenant.model";
import {SnTablesData} from "../generated/sn-ssonext-tables";
import {DB} from "../shared/postgres-db.service";

@Injectable()
export class TenantService {

  private tableName = "sn_tenant";

  constructor(private db: DB) {
  }

  async onModuleInit() {
    await this.generateTable()
  }

  async generateTable() {
    console.log("generateTable: ", this.tableName)
    const {sn_user} = SnTablesData.tableNames
    const {userid} = SnTablesData.sn_user
    await this.db.query(`
            create table if not exists ${this.tableName} (
                tenantid  BIGSERIAL PRIMARY KEY,
                userid bigint UNIQUE REFERENCES ${sn_user}(userid),
                configuration jsonb,
                created TIMESTAMPTZ,
                tenant text
            );
        `)
  }
  
  create() {
    return 'This action adds a new tenant';
  }

  findAll() {
    return `This action returns all tenant`;
  }

  findOne(id: number) {
    return `This action returns a #${id} tenant`;
  }

  update(id: number) {
    return `This action updates a #${id} tenant`;
  }

  remove(id: number) {
    return `This action removes a #${id} tenant`;
  }
  
  async configuration(tenant:string):Promise<TenantConfiguration>{
    return defaultTenantConfig()
  }
  
}
