import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { HttpClient } from '@angular/common/http';
import * as auth0 from 'auth0-js';

import { Router, ActivatedRoute } from '@angular/router';
import { filter } from 'rxjs/operators';
import { ConfigService } from './config.service';

@Injectable()
export class AuthenticationService {

    auth0 : any;

    public userProfile : any;

    requestedUrl : string = "";
      
  constructor(
      private http: HttpClient, 
      private jwtHelperService: JwtHelperService,
      public router: Router, 
      public activatedRoute : ActivatedRoute, 
      private cfg : ConfigService
    ) {

      this.createAuth0();

    }

  createAuth0(){

    this.auth0 = new auth0.WebAuth({
      clientID: this.cfg.auth_clientId,
      domain: this.cfg.auth_domain,
      responseType: this.cfg.auth_responseType,
      audience: this.cfg.auth_audience,
      redirectUri: this.cfg.auth_redirectUri,
      scope: this.cfg.auth_scope
    });

  }

  public login(): void {

    this.auth0.authorize();
    
  }

  public handleAuthentication(cb): void {

    const self = this;

    this.auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        window.location.hash = '';
        this.setSession(authResult, cb);
      } else if (err) {
        this.router.navigate(['/']);
        console.log(err);
      }
    });
  }

  private setSession(authResult, cb): void {

    const self = this;

    // Set the time that the Access Token will expire at
    const expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());
    localStorage.setItem('access_token', authResult.accessToken);
    localStorage.setItem('id_token', authResult.idToken);
    localStorage.setItem('expires_at', expiresAt);

    let userId = authResult.idTokenPayload["https://app.comfash.com/cf_id"]; 

    localStorage.setItem('userId',userId)

    let profile = authResult.idTokenPayload; 

    self.userProfile = profile;
    


    this.router.navigate(['/room', userId]);

    cb('', profile);

  }

  public logout(): void {
    // Remove tokens and expiry time from localStorage
    localStorage.clear();
    // Go back to the home route
    this.router.navigate(['/login']);
  }

  public isAuthenticated(): boolean {
    // Check whether the current time is past the
    // Access Token's expiry time
    const expiresAt = JSON.parse(localStorage.getItem('expires_at'));

    if (new Date().getTime() < expiresAt){
        return true;
    }else{

        let snapshot = this.activatedRoute.snapshot as any;
        let requestedUrl = window.location.pathname;

        console.log(requestedUrl);

        if (snapshot._routerState.url != '/login'){

              if (requestedUrl != "" && requestedUrl != "/login"){
                this.requestedUrl = requestedUrl; 

              }
              
            this.logout();
        }

       
    }
  }


  public getProfile(cb): void {
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
      throw new Error('Access Token must exist to fetch profile');
    }
  
    const self = this;
    this.auth0.client.userInfo(accessToken, (err, profile) => {
      if (profile) {
        self.userProfile = profile;
      }
      cb(err, profile);
    });
  }

  hideIfNotOwner(userId){
    if (userId == this.getUserId()){
        return false;
    }else{
        return true;
    }
  }

  getUserId(){
      return localStorage.getItem("userId");
  }


  getToken(){
      return localStorage.getItem("id_token");
  }

  getAuthStatus(): boolean {
    // Check whether the current time is past the
    // Access Token's expiry time
    const expiresAt = JSON.parse(localStorage.getItem('expires_at'));

    if (new Date().getTime() < expiresAt){
        return true;
    }else{
        return false;
       
    }
  }
}