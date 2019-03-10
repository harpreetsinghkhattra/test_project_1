import { TestBed, inject } from '@angular/core/testing';

import { IshaanviSharedataService } from './ishaanvi-sharedata.service';

describe('IshaanviSharedataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [IshaanviSharedataService]
    });
  });

  it('should be created', inject([IshaanviSharedataService], (service: IshaanviSharedataService) => {
    expect(service).toBeTruthy();
  }));
});
