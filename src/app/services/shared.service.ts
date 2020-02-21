import { StorageService } from './storage.service';
import { User } from './../model/user.model';
import { Injectable } from '@angular/core';
import { EventEmitter } from '@angular/core';

@Injectable()
export class SharedService {

  public static instance : SharedService = null;
  public storage:StorageService
  user: User;
  token: string;
  showTamplate = new EventEmitter<boolean>();

  constructor() { 
    return SharedService.instance = SharedService.instance || this;
  }

  public static getInstance(){
    if(this.instance == null){
      this.instance = new SharedService();
    }
    return this.instance;
  }

  isLoggedIn():boolean{
    if(this.user == null){
      return false;
    }
    return this.user.email != '';
  }
}
