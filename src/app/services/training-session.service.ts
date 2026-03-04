import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class TrainingSessionService {
  private readonly url = 'https://localhost:7281/api/TrainingSessions';

  constructor(private http: HttpClient) {}

  /**
   * Crea múltiples sesiones de entrenamiento en bulk
   * @param request Datos de las sesiones de entrenamiento a crear
   * @returns Observable con el array de IDs creados
   */
  // createBulkTrainingSessions(request: CreateTrainingSessions): Observable<ApiResponse<number[]>> {
  //   return this.http.post<ApiResponse<number[]>>(`${this.url}/bulk`, request);
  // }
}
