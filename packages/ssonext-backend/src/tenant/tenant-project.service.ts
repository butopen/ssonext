import { Injectable } from '@nestjs/common';
import { defaultTenantConfig, TenantConfiguration } from './tenant.model';
import { DB } from '../shared/postgres-db.service';
import { TenantData } from '../shared/ssonext.model';

@Injectable()
export class TenantProjectService {
  private tableName = 'sn_tenantproject';

  constructor(private db: DB) {}

  async onModuleInit() {
    await this.generateTable();
  }

  async generateTable() {
    await this.db.query(`
            create table if not exists ${this.tableName} (
                code BIGSERIAL PRIMARY KEY,
                name text,
                color text,
                tenant BIGINT REFERENCES sn_tenant(tenantid),
                data jsonb,
                created TIMESTAMPTZ
            );
        `);
  }

  async create(tenantData: TenantData) {
    const q = `insert into ${this.tableName} values (DEFAULT, $1, $2, $3) returning tenantid`;
    const result = await this.db.query<{ tenantid: string }>(q, [
      'active',
      tenantData,
      new Date(),
    ]);
    return result[0].tenantid;
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

  async configuration(tenant: string): Promise<TenantConfiguration> {
    return defaultTenantConfig();
  }

  async findTenantByEmail(email: string) {
    const q = `select * from ${this.tableName} where data -> 'registrationEmail' = $1`;
    const result = await this.db.query(q, [email]);
    return result;
  }
}
