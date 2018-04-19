import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthenticationService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  
  constructor(
    private auth: AuthenticationService,
    private router: Router,
  ) {}

  canActivate(): boolean {
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