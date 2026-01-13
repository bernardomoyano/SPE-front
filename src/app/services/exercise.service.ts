import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/api-response.model';
import { Exercise } from '../models/exercise.model';
import { CreateExerciseRequest } from '../models/create-exercise-request.model';
import { PaginatedResponse } from '../models/paginated-response.model';
import { ExerciseFilters } from '../models/exercise-filters.model';

@Injectable({
  providedIn: 'root'
})
export class ExerciseService {
  private readonly url = 'https://localhost:7281/api/Exercises';

  constructor(private http: HttpClient) {}

  /**
   * Obtiene los ejercicios del coach actual con paginación y filtros
   * @param filters Filtros y parámetros de paginación
   * @returns Observable con la respuesta paginada
   */
  getMyExercises(filters: ExerciseFilters): Observable<ApiResponse<PaginatedResponse<Exercise>>> {
    let params = new HttpParams()
      .set('pageNumber', filters.pageNumber.toString())
      .set('pageSize', filters.pageSize.toString())
      .set('sortBy', filters.sortBy)
      .set('sortDescending', filters.sortDescending.toString());

    if (filters.searchTerm) {
      params = params.set('searchTerm', filters.searchTerm);
    }

    if (filters.isCommon !== undefined && filters.isCommon !== null) {
      params = params.set('isCommon', filters.isCommon.toString());
    }

    if (filters.muscleGroupId) {
      params = params.set('muscleGroupId', filters.muscleGroupId.toString());
    }

    return this.http.get<ApiResponse<PaginatedResponse<Exercise>>>(`${this.url}/my-exercises`, { params });
  }

  /**
   * Crea un nuevo ejercicio
   * @param request Datos del ejercicio a crear
   * @returns Observable con la respuesta de la API
   */
  createExercise(request: CreateExerciseRequest): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(this.url, request);
  }
}
