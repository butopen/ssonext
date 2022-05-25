export class TokenService {
  private TOKEN = 'TOKEN';

  constructor(private options = { persist: true, tokenName: 'TOKEN' }) {
    this.TOKEN = options?.tokenName ?? 'TOKEN';
  }

  has() {
    return (
      sessionStorage.getItem(this.TOKEN) != null ||
      localStorage.getItem(this.TOKEN) != null
    );
  }

  get() {
    return sessionStorage.getItem(this.TOKEN) || localStorage.getItem(this.TOKEN);
  }

  set(token: string) {
    if (this.options.persist) localStorage.setItem(this.TOKEN, token);
    else this.setSessionToken(token);
  }

  setSessionToken(token: string) {
    sessionStorage.setItem(this.TOKEN, token);
  }

  hasRole(roleName: string) {
    const roles = this.roles();
    return roles.indexOf(roleName) >= 0;
  }

  roles(): string[] {
    const tdata = this.tokenData();
    const roles = tdata && tdata.roles ? tdata.roles : [];
    return roles;
  }

  logout() {
    localStorage.removeItem(this.TOKEN);
    sessionStorage.removeItem(this.TOKEN);
  }

  username(): string | undefined {
    return this.tokenData()?.sub;
  }

  isExpired(): boolean {
    const token = this.tokenData();
    if (token) {
      const tokenExp = +token.exp * 1000;
      return new Date().getTime() > tokenExp;
    }
    return true;
  }

  private tokenData(token?: string) {
    const t = token ?? this.get();
    const tdata = this.get() ? JSON.parse(atob(t!.split('.')[1])) : null;
    return tdata;
  }
}
