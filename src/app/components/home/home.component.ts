import { UserService } from './../../services/user.service';
import { SharedService } from './../../services/shared.service';
import { StorageService } from './../../services/storage.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  public shared: SharedService;
  constructor(
    private storage: StorageService,
    private userService: UserService
    ) { }

  ngOnInit() {
    console.log("tela home");
  }



}
