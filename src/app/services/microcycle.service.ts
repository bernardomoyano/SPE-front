import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/api-response.model';
import { Microcycle } from '../models/microcycles/microcycle.model';

@Injectable({
  providedIn: 'root'
})
export class TrainingSessionService {
  private readonly url = 'https://localhost:7281/api/Microcycles';

  constructor(private http: HttpClient) {}

  /**
   * Crea múltiples sesiones de entrenamiento en bulk
   * @param request Datos de las sesiones de entrenamiento a crear
   * @returns Observable con el array de IDs creados
   */
  getMicrocycleById(id: number): Observable<ApiResponse<Microcycle>> {
  return this.http.get<ApiResponse<Microcycle>>(`${this.url}/${id}`);
}

    // PUT: Actualizar microciclo completo
    updateMicrocycle(id: number, microcycle: Microcycle): Observable<ApiResponse<any>> {
    return this.http.put<ApiResponse<any>>(`${this.url}/${id}`, microcycle);
    }
}
