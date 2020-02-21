import { TestBed, inject } from '@angular/core/testing';

import { InspecaoService } from './inspecao.service';

describe('InspecaoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [InspecaoService]
    });
  });

  it('should be created', inject([InspecaoService], (service: InspecaoService) => {
    expect(service).toBeTruthy();
  }));
});
