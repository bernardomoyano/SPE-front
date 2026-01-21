import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/api-response.model';
import { StudentDto } from '../models/student.model';
import { PaginatedResponse } from '../models/paginated-response.model';
import { StudentFilters } from '../models/student-filters.model';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private readonly url = 'https://localhost:7281/api/Students';

  constructor(private http: HttpClient) {}

  /**
   * Obtiene los estudiantes del coach actual con paginación y filtros
   * @param filters Filtros y parámetros de paginación
   * @returns Observable con la respuesta paginada
   */
  getMyStudents(filters: StudentFilters): Observable<ApiResponse<PaginatedResponse<StudentDto>>> {
    let params = new HttpParams()
      .set('pageNumber', filters.pageNumber.toString())
      .set('pageSize', filters.pageSize.toString())
      .set('sortBy', filters.sortBy)
      .set('sortDescending', filters.sortDescending.toString());

    if (filters.searchTerm) {
      params = params.set('searchTerm', filters.searchTerm);
    }

    if (filters.gender) {
      params = params.set('gender', filters.gender);
    }

    return this.http.get<ApiResponse<PaginatedResponse<StudentDto>>>(`${this.url}/my-students`, { params });
  }
}