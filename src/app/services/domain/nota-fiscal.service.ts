import { EquipamentoDTO } from './../../model/DTO/Equipamento.DTO';
import { API_CONFIG } from '../../config/api.config';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { StorageService } from '../storage.service';
import { NotaFiscalDTO } from '../../model/DTO/NotaFiscal.DTO';

@Injectable()
export class NotaFiscalService {

  constructor(public http: HttpClient,
    public storage: StorageService) {

  }

  findById(notaFiscal: string) {
    return this.http.get(`${API_CONFIG.baseUrl}/notafiscal/${notaFiscal}`);
  }

  findAll() {
    return this.http.get(`${API_CONFIG.baseUrl}/notafiscal`);
  }

  inserir(notaFiscal : NotaFiscalDTO){
    return this.http.post(`${API_CONFIG.baseUrl}/notafiscal`, notaFiscal);
  }

  update(notaFiscal : NotaFiscalDTO){
    return this.http.put(`${API_CONFIG.baseUrl}/notafiscal`, notaFiscal);
  }

  delete(id: number){
    return this.http.delete(`${API_CONFIG.baseUrl}/notafiscal/${id}`);
  }
}
