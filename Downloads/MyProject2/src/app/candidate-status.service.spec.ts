import { TestBed } from '@angular/core/testing';

import { CandidateStatusService } from './candidate-status.service';

describe('CandidateStatusService', () => {
  let service: CandidateStatusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CandidateStatusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
