export function jwtDecode<T>(token: string): T {
  return JSON.parse(atob(token.split('.')[1]));
}
