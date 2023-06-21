import { TestBed } from '@angular/core/testing';

import { TtwwService } from './ttww.service';

describe('TtwwService', () => {
  let service: TtwwService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TtwwService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
