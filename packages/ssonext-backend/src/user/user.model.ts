export interface SNLoginUser {
  email: string;
  password: string;
}

type UserPredefinedRole =
  | 'UNCONFIRMED_EMAIL'
  | 'EMAIL_CONFIRMED'
  | 'ADMIN'
  | 'USER'
  | 'TENANT_OWNER';

export interface SNUser {
  userid: number;
  email: string;
  password: string;
  roles: UserPredefinedRole[];
  created: Date;
  tenant: string;
  info: unknown;
}

export type SNUserWithoutId = Omit<SNUser, 'userid'>;
export type SNUserWithoutPassword = Omit<SNUser, 'password'>;
