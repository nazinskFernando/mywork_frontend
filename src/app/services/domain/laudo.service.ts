import { API_CONFIG } from '../../config/api.config';
import { Injectable } from '@angular/core';
import { StorageService } from '../storage.service';
import { HttpClient } from '@angular/common/http';
import { LaudoDTO } from '../../model/DTO/Laudo.DTO';

@Injectable()
export class LaudoService {

  constructor(public http: HttpClient,
    public storage: StorageService) { }

  delete(id: number){
    return this.http.delete(`${API_CONFIG.baseUrl}/laudo/${id}`);
  }

  update(LaudoDTO : LaudoDTO){
    return this.http.put(`${API_CONFIG.baseUrl}/laudo`, LaudoDTO);
  }

}
