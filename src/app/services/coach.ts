import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CoachRegisterRequest } from '../models/coach.model';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Coach {
  private apiUrl = 'https://tu-backend-url/api/coach/register'; // Reemplaza con la URL real

  constructor(private http: HttpClient) {}

  registerCoach(data: CoachRegisterRequest): Observable<any> {
    return this.http.post<any>(this.apiUrl, data)
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('Error en registro de coach:', error);
    return throwError(() => new Error('Error al registrar coach. Inténtalo de nuevo.'));
  }
}
