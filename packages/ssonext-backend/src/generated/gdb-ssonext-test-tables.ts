/**
 * AUTO-GENERATED FILE @ Thu, 24 Mar 2022 11:09:12 GMT
 */

export interface SnTenant {
  tenantid: string;
  email?: string | null;
  status?: string | null;
  service?: string | null;
  data?: unknown | null;
  created?: Date | null;
}

export interface SnUser {
  userid: number;
  email?: string | null;
  password?: string | null;
  roles?: unknown | null;
  created?: Date | null;
  tenant?: string | null;
  info?: unknown | null;
}

export interface GdbTables {
  sn_tenant: SnTenant;
  sn_user: SnUser;
}

export const GdbTablesData = {
  tableNames: { sn_tenant: 'sn_tenant', sn_user: 'sn_user' },
  sn_tenant: {
    tableName: 'sn_tenant',
    tenantid: 'sn_tenant.tenantid',
    email: 'sn_tenant.email',
    status: 'sn_tenant.status',
    service: 'sn_tenant.service',
    data: 'sn_tenant.data',
    created: 'sn_tenant.created',
  },
  sn_user: {
    tableName: 'sn_user',
    userid: 'sn_user.userid',
    email: 'sn_user.email',
    password: 'sn_user.password',
    roles: 'sn_user.roles',
    created: 'sn_user.created',
    tenant: 'sn_user.tenant',
    info: 'sn_user.info',
  },
};
