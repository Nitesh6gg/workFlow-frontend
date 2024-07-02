import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor {

  constructor() { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const authToken = localStorage.getItem('authToken');
    console.log('Auth Token:', authToken); // Log the token to ensure it is being retrieved

    if (authToken) {
      const clonedReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${authToken}`
        }
      });

      console.log('Intercepted HTTP request:', clonedReq); // Log the cloned request to verify the header
      return next.handle(clonedReq);
    } else {
      return next.handle(req);
    }
  }
}
