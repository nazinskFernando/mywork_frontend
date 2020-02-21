import { ResponseApi } from '../../../model/response-api';
import { Router } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { SharedService } from '../../../services/shared.service';
import { Component, OnInit } from '@angular/core';
import { NewUser } from '../../../model/DTO/newUser.DTO';
import { DialogService } from '../../../dialog.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {

  page:number=0;
  count:number=2;
  pages:Array<number>;
  shared: SharedService;
  message:{};
  classCss:{};
  listUser:{};
  usuarios: Array<NewUser>;
  showSpinner: boolean = true;

  constructor(
    private dialogService: DialogService,
    private userService: UserService,
    private router: Router
  ) { 
    this.shared = SharedService.getInstance();
  }

  ngOnInit() {
    console.log("lista de usuario");
    this.findAll(0, 2);
  }

  findAll(page:number, count: number){
    this.userService.findAll(page, count).subscribe((responseApi : ResponseApi) => {
      this.listUser = responseApi['content']; 
      this.pages = new Array(responseApi['totalPages']);
      console.log("findAll");
      console.log('Response: ' + responseApi);
      //this.showSpinner = false;
      console.log(this.pages); 
    }, error => {});
  }

  edit(id: string){
    this.router.navigate(['/user-new',id]);
  }

  delete(id:string){
    this.dialogService.confirm('Deseja realmente excluir?')
    .then((candelete:boolean) => {
        if(candelete){
          this.message = {};
          this.userService.delete(id).subscribe((responseApi:ResponseApi) => {
          this.findAll(this.page, this.count);
          }), err =>{};
        }
      });
  
  }

  setNextPage(event: any){
    event.preventDefault();
    if(this.page < (this.pages.length - 1)){
      this.page = this.page + 1;
      this.findAll(this.page, this.count);
      console.log("setNextPage page: " + this.page +"pages:" + this.pages );
    } 
  }

  setPreviousPage(event: any){
    event.preventDefault();
    if(this.page > 0){
      this.page = this.page - 1;
     this.findAll(this.page, this.count);
      console.log("setPreviousPage");
   }
  }

  setPage(i, event: any) {
    event.preventDefault();
    this.page = i;
    this.findAll(this.page, this.count);
    console.log("setPage");
  }
}
