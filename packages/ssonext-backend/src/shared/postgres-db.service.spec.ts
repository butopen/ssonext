import { Test, TestingModule } from '@nestjs/testing';
import { PostgresDbService } from './postgres-db.service';

describe('PostgresDbService', () => {
  let service: PostgresDbService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PostgresDbService],
    }).compile();

    service = module.get<PostgresDbService>(PostgresDbService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
