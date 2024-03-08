import { Injectable, inject } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, catchError, retry, switchMap, throwError } from 'rxjs';
import { AuthService } from './services/auth.service';

@Injectable()
export class InterceptorService implements HttpInterceptor {
  private readonly authSvr = inject(AuthService);

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token = this.authSvr.getToken();

    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          return this.refreshTokenAndRetry(request, next);
        } else {
          return throwError(() => error);
        }
      })
    );
  }

  private refreshTokenAndRetry(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const refreshToken = this.authSvr.getRefresh() as string;

    return this.authSvr.refreshToken(refreshToken).pipe(
      switchMap((res: { access: string; refresh: string }) => {
        this.authSvr.setAccessToken(res.access); // Setea el nuevo token
        this.authSvr.setRefreshToken(res.refresh);

        // Reenvía la solicitud original con el nuevo token y reintentos
        request = request.clone({
          setHeaders: {
            Authorization: `Bearer ${res.access}`,
          },
        });

        return next.handle(request).pipe(retry({ count: 3, delay: 3000 }));
      }),
      catchError((refreshError) => {
        return throwError(() => refreshError);
      })
    );
  }
}
