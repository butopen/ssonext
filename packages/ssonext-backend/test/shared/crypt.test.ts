import { CryptService } from '../../src/crypt/crypt.service';

test('test encode/decode of userids', async () => {
  const service = new CryptService();
  expect(1).toBe(service.decode(service.encode(1)));
  expect(1000).toBe(service.decode(service.encode(1000)));
  expect(15).not.toBe(service.decode(service.encode(2324234)));
  expect(2324234).toBe(service.decode(service.encode(2324234)));
});

test('test controlled password generator', async () => {
  const service = new CryptService('hello');
  const pwd = service.generateRandomPassword(() => 123456);
  console.log('pwd: ', pwd);
  expect(pwd).toBe('re0qgq54@1l9j9551');
});

test('test random password generator', async () => {
  const service = new CryptService('hello');
  const pwd = service.generateRandomPassword();
  console.log('pwd: ', pwd);
  expect(pwd.length).toBeGreaterThan(16);
  expect(pwd).toContain('@');
});
