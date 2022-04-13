import { TenantService } from '../../src/tenant/tenant.service';
import { ConfigService } from '../../src/shared/config.service';
import { TenantController } from '../../src/tenant/tenant.controller';
import { EmailService } from '../../src/email/email.service';
import { TokenService } from '../../src/token/token.service';
import { createMockProxy } from '../jest.util';
import { UserController } from '../../src/user/user.controller';
import { UserService } from '../../src/user/user.service';
import { CryptService } from '../../src/crypt/crypt.service';

beforeAll(() => {
  require('dotenv').config();
});

test('test sending email', async () => {
  const c = new ConfigService();
  const email = createMockProxy<EmailService>(); //new EmailService(c.email);
  email.send.mockImplementation((...args) => {
    console.log(args);
    return Promise.resolve({ sent: true });
  });
  const t = new TokenService(c.master_password);
  const ts = createMockProxy<TenantService>();
  ts.findTenantByEmail.mockReturnValue(Promise.resolve([]));

  const tc = new TenantController(email, t, ts, null, null, new CryptService());
  const result = await tc.subscribe('info@thefrontendteam.com');
  console.log('result: ', result);
});

test('test creating tenant', async () => {
  const c = new ConfigService();
  const email = createMockProxy<EmailService>(); //new EmailService(c.email);
  const t = new TokenService(c.master_password);
  const ts = createMockProxy<TenantService>();
  const uc = createMockProxy<UserController>();
  uc.login.mockImplementation(() => Promise.resolve({ token: '1' }));
  const us = createMockProxy<UserService>();
  us.createUser.mockImplementation(() => Promise.resolve([{ userid: 1 }]));

  const token = t.generate({ email: 'info@thefrontendteam.com' });
  const tc = new TenantController(email, t, ts, uc, us, new CryptService());

  const result = await tc.confirm(token);
  expect(ts.create.mock.calls.length).toBe(1);
  console.log('result: ', result);
  expect(result.token).toBe('1');
});
