import type { ServiceData } from '@butopen/ssonext-model';
import { HttpService, jsonToQueryString } from '../shared/http.service';
import { setLoading } from '../stores/app.store';
import { TokenService } from '../shared/token.service';

const http = new HttpService('http://localhost:3003/api', 'SSONEXT_TOKEN', {
  beforeRequest: () => setLoading(true),
  afterRequest: () => setLoading(false)
});

const tokenApi = new TokenService({ persist: true, tokenName: 'SSONEXT_TOKEN' });

export async function subscribeTenant(email: string) {
  return await http.get(`/tenant/subscribe${jsonToQueryString({ email })}`);
}

export async function confirmTenant(token: string) {
  return await http.get(`/tenant/confirm${jsonToQueryString({ token })}`);
}

export async function forgotPassword(email: string, tenant: string) {
  return await http.post(`/user/forgot-password`, { email, tenant });
}

export async function resetPassword(password: string, token: string) {
  return await http.post(`/user/reset-password`, { password, token });
}

export async function login(email: string, password: string, tenant: string) {
  return await http.post(`/user/login?tenant=${tenant}`, { email, password });
}

export async function existsServiceName(service: string) {
  return await http.get(`/tenant/exists${jsonToQueryString({ service })}`);
}

export async function updateTenantService(service: ServiceData) {
  return await http.post(`/tenant/service`, service);
}

export async function requestRegistration(
  user: { name: String; surname: string; email: string; password: string },
  tenant: string
) {
  return await http.post(`/user/request-registration?tenant=${tenant}`, user);
}

export async function emailExists(
  email: string,
  tenant: string
): Promise<{ exists: boolean }> {
  return await http.get(`/user/email-exists${jsonToQueryString({ email, tenant })}`);
}

export function saveToken(token: string) {
  tokenApi.set(token);
}

export function navigateTo(path: string) {
  window.location.href = path;
}
