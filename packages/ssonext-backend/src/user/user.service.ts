import { Injectable, OnModuleInit } from '@nestjs/common';
import { TableService } from '../shared/ssonext.model';
import { CryptService } from '../crypt/crypt.service';
import { DB } from '../shared/postgres-db.service';
import { TenantService } from '../tenant/tenant.service';
import { SNUser } from './user.model';
import { SnUser } from '../generated/gdb-ssonext-test-tables';

@Injectable()
export class UserService implements TableService, OnModuleInit {
  private tableName = 'sn_user';

  constructor(
    private db: DB,
    private crypt: CryptService,
    private tenantService: TenantService,
  ) {}

  async onModuleInit() {
    await this.generateTable();
  }

  async generateTable() {
    await this.tenantService.generateTable();
    console.log('generateTable: ', this.tableName);
    const tableExists = await this.db.tableExists(this.tableName);
    console.log(this.tableName + ' tableExists: ', tableExists);
    if (!tableExists)
      await this.db.query(`
            create table if not exists ${this.tableName} (
                userid  BIGSERIAL PRIMARY KEY,
                email text,
                password text,
                roles jsonb,
                created TIMESTAMPTZ,
                tenant UUID REFERENCES sn_tenant(tenantid),
                info jsonb
            );
            
            ALTER TABLE ${this.tableName} ENABLE ROW LEVEL SECURITY;
            
            DROP POLICY IF EXISTS usertenant_isolation_policy ON ${this.tableName};
            
            CREATE POLICY usertenant_isolation_policy ON ${this.tableName} USING (tenant::TEXT = current_user);
        `);
  }

  async createUser(user: Omit<SnUser, 'userid'>) {
    let insertUser = `insert into ${this.tableName} values(DEFAULT,$1,$2,$3,$4,$5,$6) returning userid `;
    return await this.db.query<{ userid: SnUser['userid'] }>(insertUser, [
      user.email,
      this.crypt.hash(user.password),
      JSON.stringify(user.roles),
      new Date(),
      user.tenant,
      JSON.stringify(user.info ?? {}),
    ]);
  }

  async allUsers(page: number, size: number, tenant: string) {
    const users = `select * from ${this.tableName} order by email where tenant = $3 limit $1 offset $2 `;
    return await this.db.query<SnUser>(users, [size, page * size, tenant]);
  }

  async countUsers(tenant: string) {
    const usersCount = `select count(*) from ${this.tableName} where tenant = $3`;
    const result = await this.db.query<{ count: number }>(usersCount, [tenant]);
    return result[0].count;
  }

  async updateUserInformation(
    userid: SnUser['userid'],
    information: unknown,
    tenant: string,
  ) {
    const updateRoles = `update ${this.tableName} set info = $1 where userid = $2 AND tenant = $3`;
    return await this.db.query(updateRoles, [information, userid, tenant]);
  }

  async updateUserRoles(
    userid: SnUser['userid'],
    roles: string[],
    tenant: string,
  ) {
    const updateRoles = `update ${this.tableName} set roles = $1 where userid = $2 AND tenant = $3`;
    return await this.db.query(updateRoles, [
      JSON.stringify(roles),
      userid,
      tenant,
    ]);
  }

  async deleteUser(userid: SnUser['userid'], tenant: string) {
    const deleteUser = `delete from ${this.tableName} where userid = $1 AND tenant = $2`;
    return await this.db.query(deleteUser, [userid, tenant]);
  }

  async findUserByEmail(email: string, tenant: string) {
    const findByEmail = `select * from ${this.tableName} where email = $1 AND tenant = $2`;
    return await this.db.query<SnUser>(findByEmail, [email, tenant]);
  }

  async findGlobalUserByEmail(email: string) {
    const findByEmail = `select * from ${this.tableName} where email = $1`;
    return await this.db.query<SnUser>(findByEmail, [email]);
  }

  async deleteGlobalUserById(id: SNUser['userid']) {
    const findByEmail = `delete from ${this.tableName} where userid = $1`;
    return await this.db.query<SnUser>(findByEmail, [id]);
  }

  async findUser(email: string, password: string, tenant: string) {
    let found = await this.findUserByEmail(email, tenant);
    if (found.length > 0) {
      let u = found[0];
      if (this.crypt.check(password, u.password)) {
        delete (u as any).password;
        return [u];
      }
    }
    return [];
  }

  async findUserByRole(
    role: string,
    page: number,
    size: number,
    tenant: string,
  ) {
    const findByRole = `select * from ${this.tableName} where roles ? $3  AND tenant = $4 limit $1 offset $2 `;
    return await this.db.query<SnUser>(findByRole, [
      size,
      page * size,
      role,
      tenant,
    ]);
  }

  async countUsersByRole(role: string, tenant: string) {
    const usersCount = `select count(*) from ${this.tableName} where roles ? $1  AND tenant = $2`;
    const result = await this.db.query<{ count: number }>(usersCount, [
      role,
      tenant,
    ]);
    return result[0].count;
  }

  async resetUserPassword(
    userid: SnUser['userid'],
    password: string,
    tenant: string,
  ) {
    const resetPassword = `update ${this.tableName} set password = $1 where userid = $2  AND tenant = $3`;
    return await this.db.query(resetPassword, [
      this.crypt.hash(password),
      userid,
      tenant,
    ]);
  }

  async findUserById(userid: SnUser['userid'], tenant: string) {
    const findUserById = `select * from ${this.tableName} where userid = $1 AND tenant = $2`;
    return await this.db.query<SnUser>(findUserById, [userid, tenant]);
  }

  async userWithEmailExists(email: string, tenant: string) {
    const result = await this.findUserByEmail(email, tenant);
    return result.length > 0;
  }
}
