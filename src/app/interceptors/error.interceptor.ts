import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {

  const snackBar = inject(MatSnackBar);

  return next(req).pipe(

    catchError((error) => {

      snackBar.open(
        'Server error occurred. Please try again.',
        'Close',
        { duration: 4000 }
      );

      return throwError(() => error);

    })

  );

};