import { UserListComponent } from '../user-list/user-list.component';
import { StorageService } from '../../../services/storage.service';
import { NewUser } from '../../../model/DTO/newUser.DTO';
import { ResponseApi } from '../../../model/response-api';
import { UserService } from '../../../services/user.service';
import { Router, ActivatedRoute } from '@angular/router';
import { SharedService } from '../../../services/shared.service';
import { User } from '../../../model/user.model';

import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-user-new',
  templateUrl: './user-new.component.html',
  styleUrls: ['./user-new.component.css']
})
export class UserNewComponent implements OnInit {

  @ViewChild("form")
  form: NgForm

  user = new User('', '');
  newUser = new NewUser('','', '', '', '', '');
  shared: SharedService;
  message: {type: string, text: string};
  classCss: {};
  userListComponent:UserListComponent;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private storage: StorageService,
    private userService: UserService,
  ) {
    this.shared = SharedService.getInstance();
     
  }

  ngOnInit() {   

    let id: string = this.route.snapshot.params['id'];
    if(id != undefined){
      this.findById(id);
    }
  }

  findById(id: string) {
    this.userService.findById(id).subscribe((responseApi: ResponseApi) => {
      //this.newUser = responseApi; 
      console.log(this.newUser.nome);
      this.newUser.senha = "";
    }, err => { });
  }

  register(){
    this.message = null;
    this.userService.createOrUpdate(this.newUser).subscribe((responseApi: ResponseApi) => {      
      this.form.resetForm();
     // this.router.navigate(['user-list/']);
      this.showMessage({
        type: 'success',
        text: 'Registro criado com sucesso!' 
      });
      this.newUser = new NewUser('','', '', '', '', '');
    }, error => {
      this.showMessage({
        type: 'error',
        text: error['error']['errors'][0]
      });
    });
  }
  listUser() {
    throw new Error("Method not implemented.");
  }


  getFormGroupClass(isInvalid: boolean, isDirty:boolean): {} {
    return {
      'form-group': true,
      'has-error' : isInvalid  && isDirty,
      'has-success' : !isInvalid  && isDirty
    };
  }

  private showMessage(message: {type: string, text: string}): void {
      this.message = message;
      this.buildClasses(message.type);
      setTimeout(() => {
        this.message = undefined;
      }, 3000);
  }

  private buildClasses(type: string): void {
     this.classCss = {
       'alert': true
     }
     this.classCss['alert-'+type] =  true;
  }

  cancelFormulario(){
    this.message = null;
    this.newUser = new NewUser('','', '', '', '', '');
    window.location.href = '/user-new';
    window.location.reload();
  }
}
