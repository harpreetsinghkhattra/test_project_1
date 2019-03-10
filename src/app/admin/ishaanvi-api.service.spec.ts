import { TestBed, inject } from '@angular/core/testing';

import { IshaanviApiService } from './ishaanvi-api.service';

describe('IshaanviApiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [IshaanviApiService]
    });
  });

  it('should be created', inject([IshaanviApiService], (service: IshaanviApiService) => {
    expect(service).toBeTruthy();
  }));
});
