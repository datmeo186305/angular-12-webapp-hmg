import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import { MatDialog } from '@angular/material/dialog';
import { finalize } from 'rxjs/operators';
import { NotificationService } from '../services/notification.service';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  totalRequests = 0;
  completedRequests = 0;

  constructor(
    private dialog: MatDialog,
    private notificationService: NotificationService
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    Promise.resolve(null).then(() => {
      this.totalRequests++;
      this.notificationService.showLoading();
    });

    return next.handle(req).pipe(
      finalize(() => {
        this.completedRequests++;

        if (this.completedRequests === this.totalRequests) {
          this.completedRequests = 0;
          this.totalRequests = 0;
          this.notificationService.hideLoading();
        }
      })
    );
  }
}
