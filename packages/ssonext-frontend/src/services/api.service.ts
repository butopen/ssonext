import { HttpService, jsonToQueryString } from '../shared/http.service';

const http = new HttpService('/api');

export async function subscribeTenant(email: string) {
  return await http.get(`/tenant/subscribe${jsonToQueryString({ email })}`);
}

export async function forgotPassword(email: string, tenant: string) {
  return await http.get(`/user/forgot-password${jsonToQueryString({ email, tenant })}`);
}

export async function resetPassword(password: string, token: string) {
  return await http.post(`/user/reset-password`, { password, token });
}

export async function login(email: string, password: string, tenant: string) {
  return await http.post(`/user/login${tenant}`, { email, password });
}
