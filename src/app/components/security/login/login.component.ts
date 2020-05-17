import { UserService } from './../../../services/user.service';
import { SharedService } from './../../../services/shared.service';


import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../../../model/user.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  user = new User('','');
  shared : SharedService;
  message: string;

  constructor(
    private userService: UserService,
    private router: Router
  ) { 
    this.shared = SharedService.getInstance();
  }

  ngOnInit() {
  }

  login() {
    this.userService.authenticate(this.user)
      .subscribe(response  => {
        this.userService.successfulLogin(response.headers.get('Authorization'));
        this.shared.showTamplate.emit(true);
        this.router.navigate(['/']);
        
        console.log("login");
      },
      error => {
        this.message = 'error';
        this.shared.showTamplate.emit(false);
        this.shared.token = null;
        this.shared.user = null;
      });    
  }

  getFormGroupClass(isInvalid:boolean, isDirty): {} {    return {
      'form-group' : true,
      'has-error' : isInvalid && isDirty,
      'has-success' : !isInvalid && !isDirty,
      
    };
  }

}
