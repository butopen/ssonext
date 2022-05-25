import { ServiceData } from '@butopen/ssonext-model';

export interface TableService {
  generateTable(): Promise<void>;
}

export interface EmailData {
  subject: string;
  body: string;
}

export interface TenantData {
  service?: ServiceData;
}

export type UserRole =
  | 'ADMIN'
  | 'TENANT_USER'
  | 'EMAIL_CONFIRMED'
  | 'EMAIL_NOT_CONFIRMED';

export interface EmailInformation {
  emailSubject?: string;
  emailBody?: string;
}
