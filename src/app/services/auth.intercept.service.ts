import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpResponse,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { AuthenticationService } from './auth.service';
import { Observable } from 'rxjs/Observable';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(
    public auth: AuthenticationService,
    public spinner : Ng4LoadingSpinnerService
    ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    
    this.spinner.show();
    let token;
    let cloneReq;

    if (typeof(this.auth.getToken()) != 'string'){ 
       token = '';
       console.log("API Call without token");
       cloneReq = request;
    }else{

       token = `Bearer ${this.auth.getToken()}`;

       let headers = request.headers
            .set('Authorization', token);

      cloneReq = request.clone({ headers });


    }

    
    return next.handle(cloneReq).map(event => {

      if (event instanceof HttpResponse){
        this.spinner.hide();
      }
      return event;
  });
  }
  



}