import { UserService } from './../../services/user.service';
import { StorageService } from './../../services/storage.service';
import { SharedService } from './../../services/shared.service';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { Injectable } from "@angular/core";
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate{

    public shared: SharedService;

    constructor(
        private router: Router,
        public storage: StorageService,
        private userService: UserService){
        this.shared = SharedService.getInstance();
    }

    canActivate(    
        route: ActivatedRouteSnapshot, 
        state: RouterStateSnapshot): Observable<boolean> | boolean {
        if(this.storage.getLocalUser()){   
            console.log(" canActivate verdadeiro"); 
            this.shared.showTamplate.emit(true);                   
            return true;            
        } 
        this.router.navigate(['/login']);
        console.log(" canActivate falso");  
        return false;        
    }    

}