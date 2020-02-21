import { UserService } from './services/user.service';
import { StorageService } from './services/storage.service';
import { SharedService } from './services/shared.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  showTamplate :boolean = false;
  public shared : SharedService;
  
  constructor(
    public storage: StorageService,
    private userService: UserService
    ){
    this.shared = SharedService.getInstance();
  }

  ngOnInit(){
    this.shared.showTamplate.subscribe(
        show => this.showTamplate = show
    );
  }

  showContentWrapper(){
    return {
      'content-wrapper' : this.storage.getLocalUser()
    }
  }
}
