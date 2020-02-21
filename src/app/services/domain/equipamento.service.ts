import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_CONFIG } from '../../config/api.config';
import { NotaFiscalDTO } from '../../model/DTO/NotaFiscal.DTO';

@Injectable()
export class EquipamentoService {

  constructor(public http: HttpClient) { }

  findByNpNs(partNumber: string, serialNumber: string) {
    return this.http.get(`${API_CONFIG.baseUrl}/equipamentos/rastreabilidade?partNumber=${partNumber}&serialNumber=${serialNumber}`);
  } 
  findById(id: string){
    return this.http.get(`${API_CONFIG.baseUrl}/equipamentos/${id}`);
  } 

}
