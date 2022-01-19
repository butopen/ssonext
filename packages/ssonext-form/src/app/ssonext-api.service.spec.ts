import { TestBed } from '@angular/core/testing';

import { SsonextApiService } from './ssonext-api.service';

describe('SsonextApiService', () => {
  let service: SsonextApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SsonextApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
