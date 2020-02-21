import { TestBed, inject } from '@angular/core/testing';

import { EquipamentoService } from './equipamento.service';

describe('EquipamentoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EquipamentoService]
    });
  });

  it('should be created', inject([EquipamentoService], (service: EquipamentoService) => {
    expect(service).toBeTruthy();
  }));
});
