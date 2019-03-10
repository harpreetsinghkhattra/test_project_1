import { TestBed, inject } from '@angular/core/testing';

import { IshaanviAppDataService } from './ishaanvi-app-data.service';

describe('IshaanviAppDataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [IshaanviAppDataService]
    });
  });

  it('should be created', inject([IshaanviAppDataService], (service: IshaanviAppDataService) => {
    expect(service).toBeTruthy();
  }));
});
