require('dotenv').config();

import { UserService } from '../../src/user/user.service';
import { DB } from '../../src/shared/postgres-db.service';
import { TokenService } from '../../src/token/token.service';
import { Test } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { EmailService } from '../../src/email/email.service';
import { TenantService } from '../../src/tenant/tenant.service';

let app: NestFastifyApplication;
let emailMock = { send: jest.fn() };
jest.setTimeout(6 * 30000);
const email = 'info-test@thefrontendteam.com';

beforeAll(async () => {
  const moduleRef = await Test.createTestingModule({
    imports: [AppModule],
  })
    .overrideProvider(EmailService)
    .useValue(emailMock)
    .compile();

  app = moduleRef.createNestApplication<NestFastifyApplication>(
    new FastifyAdapter(),
  );
  await app.init();
  await app.getHttpAdapter().getInstance().ready();
});

beforeEach(async () => {
  emailMock.send.mockClear();
  const db = app.get(DB);
  await db.query(`delete from sn_user where email =  '${email}'`);
  await db.query(`delete from sn_tenant where email =  '${email}'`);
});

test('tenant should be created after email confirmation', async () => {
  const ts = app.get(TokenService);
  const token = ts.generate({
    email,
    scope: 'tenant-confirm',
  });
  const responseToConfirm = await app.inject({
    method: 'GET',
    url: `/tenant/confirm?token=${token}`,
  });
  const receivedToken = responseToConfirm.json().token;
  const receivedPassword = responseToConfirm.json().password;
  const receivedPostgresPassword = responseToConfirm.json().postgresPassword;
  expect(receivedToken).toBeDefined();
  expect(receivedPassword).toBeDefined();
  expect(receivedPostgresPassword).toBeDefined();
  const data = ts.verify(receivedToken) as any;
  expect(data.email).toBe(email);
  const us = app.get(UserService);
  const users = await us.findGlobalUserByEmail(email);
  expect(users[0].email).toBe(email);
  const tns = app.get(TenantService);
  const tenant = await tns.findTenantByEmail(email);
  expect(tenant[0].email).toBe(email);
});

test('tenant registers', async () => {
  const responseToSubscribe = await app.inject({
    method: 'GET',
    url: `/tenant/subscribe?email=${email}`,
  });
  expect(responseToSubscribe.json().email_sent).toBe(true);
  expect(emailMock.send.mock.calls.length).toBe(1);
  expect(emailMock.send.mock.calls[0][0]).toBe(email);
});

afterAll(async () => {
  await app.close();
});
