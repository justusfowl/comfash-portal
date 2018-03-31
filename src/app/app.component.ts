import { Component } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'app';

  hideNotificationbox : boolean = true;
  hideNotificationboxLeft : number = 300; 
  hideNotificationboxTop : number = 20; 

  constructor(private router: Router) { }


  goToCapture(collection) {
    this.router.navigate(['capture']); 
  }

  hideNotification(){
      this.hideNotificationbox = true;
  }

  showNotification(){
    let user = document.getElementById("user-avatar");
    let avatar = user.getBoundingClientRect();

    this.hideNotificationbox = false;

    this.hideNotificationboxLeft = avatar.left;
    this.hideNotificationboxTop = avatar.height + avatar.top;
    
  }

  goToProfile(){
    
    this.router.navigate(["profile"]);

  }


}


