export interface TableService {
  generateTable(): Promise<void>;
}

export interface EmailData {
  subject: string;
  body: string;
}

export interface ServiceData {
  code: string;
  name: string;
  email: string;
  color: string;
  emailText: {
    welcome: EmailData;
  };
}

export interface TenantData {
  service?: ServiceData;
}

export type UserRole =
  | 'ADMIN'
  | 'TENANT_USER'
  | 'EMAIL_CONFIRMED'
  | 'EMAIL_NOT_CONFIRMED';
