import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ApiResponse } from '../models/api-response.model';
import { Exercise } from '../models/exercise.model';

@Injectable({
  providedIn: 'root'
})
export class ExerciseService {
  private readonly url = 'https://localhost:7281/api/Exercises/my-exercises';

  constructor(private http: HttpClient) {}

  /**
   * Obtiene los ejercicios del coach actual
   * @returns Observable con la lista de ejercicios
   */
  getMyExercises(): Observable<ApiResponse<Exercise[]>> {

    return this.http.get<ApiResponse<Exercise[]>>(this.url);
  }

  /**
   * Manejo centralizado de errores HTTP
   * @param error Error de la petición HTTP
   * @returns Observable que emite el error
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Ha ocurrido un error desconocido';

    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = `Error del cliente: ${error.error.message}`;
    } else {
      // Error del lado del servidor
      if (error.status === 0) {
        errorMessage = 'No se pudo conectar con el servidor. Verifica tu conexión.';
      } else if (error.status >= 500) {
        errorMessage = 'Error del servidor. Inténtalo de nuevo más tarde.';
      } else if (error.status === 401) {
        errorMessage = 'No autorizado. Inicia sesión nuevamente.';
      } else if (error.status === 403) {
        errorMessage = 'No tienes permisos para acceder a este recurso.';
      } else if (error.status === 404) {
        errorMessage = 'Recurso no encontrado.';
      } else if (error.error && typeof error.error === 'object') {
        const apiError = error.error as ApiResponse<any>;
        if (apiError.errors && apiError.errors.length > 0) {
          errorMessage = apiError.errors.join(', ');
        } else if (apiError.message) {
          errorMessage = apiError.message;
        }
      }
    }

    console.error('ExerciseService Error:', error);
    return throwError(() => new Error(errorMessage));
  }
}
