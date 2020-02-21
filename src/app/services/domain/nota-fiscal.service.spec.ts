import { TestBed, inject } from '@angular/core/testing';

import { NotaFiscalService } from './nota-fiscal.service';

describe('NewNotaFiscalService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NotaFiscalService]
    });
  });

  it('should be created', inject([NotaFiscalService], (service: NotaFiscalService) => {
    expect(service).toBeTruthy();
  }));
});
