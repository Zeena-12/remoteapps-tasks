import { TestBed } from '@angular/core/testing';

import { DevOptionsCheckerService } from './dev-options-checker.service';

describe('DevOptionsCheckerService', () => {
  let service: DevOptionsCheckerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DevOptionsCheckerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
