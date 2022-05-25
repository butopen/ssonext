import { login, navigateTo } from './api.service';

export async function loginAndMoveToHome(
  email: string,
  password: string,
  tenant: string
) {
  const loginResult = await login(email, password, tenant);
  if (loginResult.token) {
    localStorage.TOKEN = loginResult.token;
    let destinationUrl = loginResult.destinationUrl;
    if (destinationUrl.indexOf('?') >= 0)
      destinationUrl = destinationUrl + `&token=${loginResult.token}`;
    else destinationUrl = destinationUrl + `?token=${loginResult.token}`;
    navigateTo(`${destinationUrl}&tenant=${tenant}`);
  } else throw new Error('Could not login');
}
