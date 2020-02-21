import { SharedService } from './shared.service';
import { User } from './../model/user.model';
import { StorageService } from './storage.service';
import { LocalUser } from './../model/local_user';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_CONFIG } from '../config/api.config';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';
import { NewUser } from '../model/DTO/newUser.DTO';

@Injectable()
export class UserService {

    shared: SharedService;
    jwtHelper: JwtHelperService = new JwtHelperService();

    constructor(
        public http: HttpClient,
        public storage: StorageService,
        private router: Router
    ) {
        this.shared = SharedService.getInstance();
    }   

    authenticate(creds: User) {
        return this.http.post(
            `${API_CONFIG.baseUrl}/login`,
            creds,
            {
                observe: 'response',
                responseType: 'text'
            });
    }

    refreshToken() {
        return this.http.post(
            `${API_CONFIG.baseUrl}/auth/refresh_token`,
            {},
            {
                observe: 'response',
                responseType: 'text'
            });
    }

    successfulLogin(authorizationValue: string) {
        let tok = authorizationValue.substring(7);
        let user: LocalUser = {
            token: tok,
            email: this.jwtHelper.decodeToken(tok).sub
        };

        this.storage.setLocalUser(user);
        this.router.navigate(['/']);
    }

    logout() {
        this.storage.setLocalUser(null);
    }

    createOrUpdate(user: NewUser) {
        /*return this.http.post(
            `${API_CONFIG.baseUrl}/usuarios`,
            user);*/
        if (user.id != null || user.id != "") {
            return this.http.post(`${API_CONFIG.baseUrl}/usuarios`, user);
        } else {
            return this.http.put(`${API_CONFIG.baseUrl}/usuarios`, user);
        }
    }

    findAll(page: number, count: number) {
        return this.http.get(`${API_CONFIG.baseUrl}/usuarios/page?page=${page}&linesPage=${count}&direction=DESC`);
    }

    findById(id: string) {
        return this.http.get(`${API_CONFIG.baseUrl}/usuarios/${id}`);
    }

    delete(id: string) {
        return this.http.delete(`${API_CONFIG.baseUrl}/usuarios/${id}`);
    }
}
