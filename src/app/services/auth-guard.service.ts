import { Injectable } from '@angular/core';
import { CanActivate, Router, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { AuthenticationService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  
  constructor(
    private auth: AuthenticationService,
    private router: Router,
  ) {}

  canActivate(route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {

      let uli = state; 
      console.log("im inm the guard")
    if (this.auth.isAuthenticated()) {
      return true;
    }  
    else {
      localStorage.removeItem('access_token');
      this.router.navigateByUrl('/login');
      return false;
    }
  }
}