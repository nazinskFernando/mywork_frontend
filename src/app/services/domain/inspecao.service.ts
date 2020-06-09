import { FiltroInspecaoDTO } from './../../model/DTO/FiltroInspecao.DTO';
import { InspecaoDTO } from './../../model/DTO/Inspecao.DTO';
import { API_CONFIG } from './../../config/api.config';
import { Injectable } from '@angular/core';
import { StorageService } from '../storage.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators/map';


@Injectable()
export class InspecaoService {

  constructor(public http: HttpClient,
    public storage: StorageService) { }

  getRelatorio(id: string) {    

    let headers = new HttpHeaders();
    headers.append('Accept', 'application/pdf');
    let requestOptions: any = { headers: headers, responseType: 'blob' };

    return this.http.post(`${API_CONFIG.baseUrl}/inspecao/export/${id}`, '', requestOptions)
    .pipe(map((response)=>{
    return {
      filename: 'Relatório.pdf',  
      data: new Blob([response], {type: 'application/pdf'})
    };
  })
);

    // let headers = new HttpHeaders();
    // headers = headers.set('Accept', 'application/pdf');
    // return this.http.get<any>(`${API_CONFIG.baseUrl}/inspecao/export/${id}`, { headers: headers, responseType: 'blob'});    

    //return this.http.get(`${API_CONFIG.baseUrl}/inspecao/export/${id}`);
  }
  

  findById(id: string) {
    return this.http.get(`${API_CONFIG.baseUrl}/inspecao/${id}`);
  }

  findByIdRelatorio(id: string) {
    return this.http.get(`${API_CONFIG.baseUrl}/inspecao/relatorio/${id}`);
  }

  findAll(page, linesPage, orderBy, direction) {
    return this.http.get<InspecaoDTO[]>(`${API_CONFIG.baseUrl}/inspecao/page?page=${page}&linesPage=${linesPage}&orderBy=${orderBy}&direction=${direction}`);
  }

  findAllString(page, linesPage, orderBy, direction, valor) {
    return this.http.get<InspecaoDTO[]>(`${API_CONFIG.baseUrl}/inspecao/page/filterstring?page=${page}&linesPage=${linesPage}&orderBy=${orderBy}&direction=${direction}&valor=${valor}`);
  }

  findAllFiltro(page, linesPage, orderBy, direction, status, inspetor, cliente) {
    return this.http.get<InspecaoDTO[]>(`${API_CONFIG.baseUrl}/inspecao/page/filtro?page=${page}&linesPage=${linesPage}&orderBy=${orderBy}&direction=${direction}&status=${status}&inspetor=${inspetor}&cliente=${cliente}`);
  }

  getFiltros() {
    return this.http.get<FiltroInspecaoDTO>(`${API_CONFIG.baseUrl}/inspecao/filtros`);
  }

  findByEquipamentoAndNfId(idEquipamento: string, idNotaFiscal: string) {
    return this.http.get<InspecaoDTO>(`${API_CONFIG.baseUrl}/inspecao/findbynotafiscal?idEquipamento=${idEquipamento}&idNotaFiscal=${idNotaFiscal}`);
  }

  inserir(inspecaoDTO : InspecaoDTO) {
    return this.http.post(`${API_CONFIG.baseUrl}/inspecao`, inspecaoDTO);
  }

  update(InspecaoDTO : InspecaoDTO) {
    return this.http.put(`${API_CONFIG.baseUrl}/inspecao`, InspecaoDTO);
  }

  delete(id: number) {
    return this.http.delete(`${API_CONFIG.baseUrl}/inspecao/${id}`);
  }
}
