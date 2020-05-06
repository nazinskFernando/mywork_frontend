import { EmailDTO } from './../../model/DTO/Email.DTO';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_CONFIG } from '../../config/api.config';

@Injectable()
export class EmailService {

  constructor(public http: HttpClient) { }

  inserir(emailDTO : EmailDTO){
    return this.http.post(`${API_CONFIG.baseUrl}/email`, emailDTO);
  }

  update(emailDTO : EmailDTO){
    return this.http.put(`${API_CONFIG.baseUrl}/email`, emailDTO);
  }

  delete(id: string){
    return this.http.delete(`${API_CONFIG.baseUrl}/email/${id}`);
  }
}
