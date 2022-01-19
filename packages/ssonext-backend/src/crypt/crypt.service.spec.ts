import { Test, TestingModule } from '@nestjs/testing';
import { CryptService } from './crypt.service';

describe('CryptService', () => {
  let service: CryptService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CryptService],
    }).compile();

    service = module.get<CryptService>(CryptService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(1).toBe(service.decode(service.encode(1)))
    expect(1).toBe(service.decode(service.encode(1000)))
    expect(1).toBe(service.decode(service.encode(2324234)))
  });
});
