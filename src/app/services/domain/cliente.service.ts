import { ClienteDTO } from './../../model/DTO/Cliente.DTO';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_CONFIG } from '../../config/api.config';

@Injectable()
export class ClienteService {

  constructor(public http: HttpClient) { }


  findAll(){
    return this.http.get<ClienteDTO[]>(`${API_CONFIG.baseUrl}/cliente`);
  } 
}
