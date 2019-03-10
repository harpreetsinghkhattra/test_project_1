import { TestBed, inject } from '@angular/core/testing';

import { IshaanviAuthService } from './ishaanvi-auth.service';

describe('IshaanviAuthService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [IshaanviAuthService]
    });
  });

  it('should be created', inject([IshaanviAuthService], (service: IshaanviAuthService) => {
    expect(service).toBeTruthy();
  }));
});
