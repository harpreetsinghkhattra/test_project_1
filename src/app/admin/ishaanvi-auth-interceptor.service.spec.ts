import { TestBed, inject } from '@angular/core/testing';

import { IshaanviAuthInterceptorService } from './ishaanvi-auth-interceptor.service';

describe('IshaanviAuthInterceptorService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [IshaanviAuthInterceptorService]
    });
  });

  it('should be created', inject([IshaanviAuthInterceptorService], (service: IshaanviAuthInterceptorService) => {
    expect(service).toBeTruthy();
  }));
});
