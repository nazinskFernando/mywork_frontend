import { InspecaoDTO } from './../../model/DTO/Inspecao.DTO';
import { API_CONFIG } from './../../config/api.config';
import { Injectable } from '@angular/core';
import { StorageService } from '../storage.service';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class InspecaoService {

  constructor(public http: HttpClient,
    public storage: StorageService) { }

  findById(id: string) {
    return this.http.get(`${API_CONFIG.baseUrl}/inspecao/${id}`);
  }

  findAll() {
    return this.http.get(`${API_CONFIG.baseUrl}/inspecao`);
  }

  findAllById(idEquipamento: string, idNotaFiscal: string){
    return this.http.get(`${API_CONFIG.baseUrl}/inspecao/findbynotafiscal?idEquipamento=${idEquipamento}&idNotaFiscal=${idNotaFiscal}`);
  }

  inserir(inspecaoDTO : InspecaoDTO){
    return this.http.post(`${API_CONFIG.baseUrl}/inspecao`, inspecaoDTO);
  }

  update(InspecaoDTO : InspecaoDTO){
    return this.http.put(`${API_CONFIG.baseUrl}/inspecao`, InspecaoDTO);
  }

  delete(id: number){
    return this.http.delete(`${API_CONFIG.baseUrl}/inspecao/${id}`);
  }
}
