import { TestBed } from '@angular/core/testing';

import { EnvironmentGuardService } from './environment-guard.service';

describe('EnvironmentGuardService', () => {
  let service: EnvironmentGuardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EnvironmentGuardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
