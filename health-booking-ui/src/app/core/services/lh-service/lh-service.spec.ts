import { TestBed } from '@angular/core/testing';

import { LhService } from './lh-service';

describe('LhService', () => {
  let service: LhService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LhService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
