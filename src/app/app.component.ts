import { Component, OnInit} from '@angular/core';
import {Router,ActivatedRoute} from "@angular/router";
import { AuthenticationService } from './services/auth.service';
import { TranslateService } from '@ngx-translate/core';
import { ApiService } from './services/api.service';
import { UtilService } from './services/util.service';
import { NotificationService } from './services/notification.service';
import { Message } from './models/datamodel';

@Component({ 
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'comfash';
  profile: any;

  hideNotificationbox : boolean = true;
  hideNotificationboxLeft : number = 300; 
  hideNotificationboxTop : number = 20; 

  constructor(
    private router: Router, 
    public activatedRoute : ActivatedRoute,
    public auth: AuthenticationService,
    public translate: TranslateService, 
    public api : ApiService, 
    public util : UtilService, 
    public notify : NotificationService) { 

    auth.handleAuthentication(this.getProfile.bind(this));

      
    translate.addLangs(["en", "de"]);
    translate.setDefaultLang('en');

    let browserLang = translate.getBrowserLang();
    translate.use(browserLang.match(/en|de/) ? browserLang : 'de');
    
  }

  getProfile(err, userProfile){
    
    if (err){
      throw new Error(err);
    }

    this.profile = userProfile;
    this.api.getMessages();
  }


  goToRoom(){

    this.router.navigate(['room', this.auth.getUserId()]); 

  }

  public isLinkActive(url: string): boolean {
    let snapshot	= this.activatedRoute.snapshot as any;
    return (snapshot._routerState.url.indexOf(url) > -1);
  }

  ngOnInit(){
    let h = document.getElementsByTagName("header")[0]; 
    let heightOffset = h.clientHeight; 
    let placeHolder = document.getElementById("header-placeholder");
    placeHolder.setAttribute("style","height:" +  (heightOffset + 15) +"px");

    if (this.auth.getToken()){
      if (this.auth.userProfile) {
        this.profile = this.auth.userProfile;
      } else {
        this.auth.getProfile((err, profile) => {
          this.profile = profile;
        });
      }
      this.api.getMessages();
    }


  }

  messageClick(message : Message){
    message.setReadStatus(0);
    this.api.updateMessageReadStatus(message);
    this.notify.navigateFromMessage(this.router, message.getLinkUrl());
  }
  

  goToCapture() {
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
    
    this.router.navigate(["profile", this.auth.getUserId()]);

  }


}


