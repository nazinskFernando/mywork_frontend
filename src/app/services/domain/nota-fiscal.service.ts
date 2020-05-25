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

  findByNumero(notaFiscal: string) {
    return this.http.get(`${API_CONFIG.baseUrl}/notafiscal/numero_nota/${notaFiscal}`);
  }
  
  getFiltros() {
    return this.http.get(`${API_CONFIG.baseUrl}/notafiscal/filtroTransportadora`);
  }

  findAll(page, linesPage, orderBy, direction) {
    return this.http.get(`${API_CONFIG.baseUrl}/notafiscal/page?page=${page}&linesPage=${linesPage}&orderBy=${orderBy}&direction=${direction}`);
  }

  findAllFiltroString(page, linesPage, orderBy, direction, valor) {
    return this.http.get(`${API_CONFIG.baseUrl}/notafiscal/page/filterstring?page=${page}&linesPage=${linesPage}&orderBy=${orderBy}&direction=${direction}&valor=${valor}`);
  }

  findAllFilter(page, linesPage, orderBy, direction, transportadora, setorDestino, cliente) {
    return this.http.get(`${API_CONFIG.baseUrl}/notafiscal/page/filter?page=${page}&linesPage=${linesPage}&orderBy=${orderBy}&direction=${direction}&transportadora=${transportadora}&setorDestino=${setorDestino}&cliente=${cliente}`);
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
