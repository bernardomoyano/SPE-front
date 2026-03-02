import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/api-response.model';
import { PlanningDto, PlanningFilters } from '../models/planning.model';
import { PaginatedResponse } from '../models/paginated-response.model';
import { CreatePlanningRequest } from '../models/create-planning-request.model';
import { PlanningWithMicrocyclesDto } from '../models/planning-with-microcycles.model';

@Injectable({
  providedIn: 'root'
})
export class PlanificationsService {
  private readonly url = 'https://localhost:7281/api/Plannings';

  constructor(private http: HttpClient) {}

  /**
   * Obtiene las planificaciones del coach actual con paginación y filtros
   * @param filters Filtros y parámetros de paginación
   * @returns Observable con la respuesta paginada
   */
  getMyPlannings(filters: PlanningFilters): Observable<ApiResponse<PaginatedResponse<PlanningDto>>> {
    let params = new HttpParams()
      .set('pageNumber', filters.pageNumber.toString())
      .set('pageSize', filters.pageSize.toString())
      .set('sortBy', filters.sortBy)
      .set('sortDescending', filters.sortDescending.toString());

    if (filters.searchTerm) {
      params = params.set('searchTerm', filters.searchTerm);
    }

    if (filters.status) {
      params = params.set('status', filters.status);
    }

    if (filters.type) {
      params = params.set('type', filters.type);
    }

    if (filters.studentId) {
      params = params.set('studentId', filters.studentId.toString());
    }

    return this.http.get<ApiResponse<PaginatedResponse<PlanningDto>>>(`${this.url}/my-plannings`, { params });
  }

  /**
   * Crea una nueva planificación
   * @param request Datos de la planificación a crear
   * @returns Observable con la respuesta de la API
   */
  createPlanning(request: CreatePlanningRequest): Observable<ApiResponse<number>> {
    return this.http.post<ApiResponse<number>>(this.url, request);
  }

  /**
   * Obtiene las planificaciones de un estudiante con sus microciclos
   * @param studentId ID del estudiante
   * @returns Observable con la respuesta de la API
   */
  getPlanningsByStudentId(studentId: number): Observable<ApiResponse<PlanningWithMicrocyclesDto[]>> {
    return this.http.get<ApiResponse<PlanningWithMicrocyclesDto[]>>(`${this.url}/student/${studentId}`);
  }
}