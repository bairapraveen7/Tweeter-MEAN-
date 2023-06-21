import { TestBed } from '@angular/core/testing';

import { CallreqService } from './callreq.service';

describe('CallreqService', () => {
  let service: CallreqService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CallreqService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
