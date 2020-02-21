import { StorageService } from './../../../services/storage.service';
import { SharedService } from './../../../services/shared.service';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";


@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    public shared : SharedService;

    constructor(private storage: StorageService){
        this.shared = SharedService.getInstance();

    }
    
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let authRequest : any;
       
        if(this.storage.getLocalUser()){
            console.log("interceptor is logado");
            authRequest = req.clone({headers: req.headers.set('Authorization', 'Bearer ' + this.storage.getLocalUser().token)});
            return next.handle(authRequest);
        } else {
            console.log("interceptor não logado");
            return next.handle(req);
        }
    }

}