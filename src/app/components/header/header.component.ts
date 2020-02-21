import { User } from './../../model/user.model';
import { StorageService } from './../../services/storage.service';
import { Router } from '@angular/router';
import { UserService } from './../../services/user.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  user: User;

  constructor(
    private userService:UserService,
    private router: Router,
    private storage: StorageService
    ) { }

  ngOnInit() {
    //this.user.email = this.storage.getLocalUser().email;
  }

  logout(){
    this.userService.logout();
    window.location.href = '/login';
    window.location.reload();
  }
}
