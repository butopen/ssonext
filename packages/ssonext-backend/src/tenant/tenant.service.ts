import { Injectable } from '@nestjs/common';
import { defaultTenantConfig, TenantConfiguration } from './tenant.model';
import { DB } from '../shared/postgres-db.service';
import { ServiceData, TenantData } from '../shared/ssonext.model';
import { SnTenant } from '../generated/gdb-ssonext-test-tables';

@Injectable()
export class TenantService {
  private tableName = 'sn_tenant';

  constructor(private db: DB) {
  }

  async onModuleInit() {
    await this.generateTable();
  }

  async generateTable() {
    console.log('generateTable: ', this.tableName);
    const tableExists = await this.db.tableExists(this.tableName);
    console.log(this.tableName + ' tableExists: ', tableExists);
    if (!tableExists) {
      await this.db.query(`
              create table if not exists ${this.tableName} (
                  tenantid UUID DEFAULT gen_random_uuid() PRIMARY KEY,
                  email text,
                  status VARCHAR(64) CHECK (status IN ('active', 'suspended', 'disabled')),
                  service text,
                  data jsonb,
                  created TIMESTAMPTZ
              );
              
              ALTER TABLE ${this.tableName} ENABLE ROW LEVEL SECURITY;
              
              DROP POLICY IF EXISTS tenant_isolation_policy ON ${this.tableName};
              
              CREATE POLICY tenant_isolation_policy ON ${this.tableName} USING (tenantid::TEXT = current_user);
              
          `);
      const defaultTenant = await this.create('info@ssonext.com');
    }
  }

  async createTenantPostgresUser({
                                   tenant,
                                   password
                                 }: {
    tenant: string;
    password: string;
  }) {
    const q = `
create user "${tenant}" with encrypted password '${password}';
GRANT SELECT ON sn_user TO "${tenant}";
    `;
    await this.db.query(q);
  }

  async create(email: string) {
    const q = `insert into ${this.tableName} values (DEFAULT, $1, $2, $3, $4, $5) returning tenantid`;
    const result = await this.db.query<{ tenantid: string }>(q, [
      email,
      'active',
      null,
      {},
      new Date()
    ]);
    return result[0].tenantid;
  }

  async configuration(tenant: string): Promise<TenantConfiguration> {
    return defaultTenantConfig();
  }

  async findTenantByEmail(email: string) {
    const q = `select * from ${this.tableName} where email = $1`;
    const result = await this.db.query<SnTenant>(q, [email]);
    return result;
  }

  async updateService(tenant: string, service: ServiceData) {
    const q = `update ${this.tableName} set data = $1 where tenantid = $2`;
    const result = await this.db.query(q, [service, tenant]);
    return result;
  }

  async loadService(tenant: string, service: ServiceData) {
    const q = `select data from ${this.tableName} where tenantid = $1`;
    const result = await this.db.query(q, [tenant]);
    return result;
  }

  async deleteTenant(tenantid: string) {
    const q = `delete from ${this.tableName} where tenantid = $1`;
    const result = await this.db.query<SnTenant>(q, [tenantid]);
    return result;
  }
}
