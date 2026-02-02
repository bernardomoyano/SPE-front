import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/api-response.model';
import { StudentDto } from '../models/student.model';
import { PaginatedResponse } from '../models/paginated-response.model';
import { StudentFilters } from '../models/student-filters.model';
import { CreateStudentRequest, UpdateStudentRequest } from '../models/create-student-request.model';

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

  /**
   * Obtiene un estudiante por su ID
   * @param id ID del estudiante
   * @returns Observable con ApiResponse<StudentDto>
   */
  getStudentById(id: number): Observable<ApiResponse<StudentDto>> {
    return this.http.get<ApiResponse<StudentDto>>(`${this.url}/${id}`);
  }

    /**
     * Crea un nuevo estudiante
     * @param request Datos del estudiante a crear
     * @returns Observable con ApiResponse
     */
    createStudent(request: CreateStudentRequest): Observable<ApiResponse<StudentDto>> {
      return this.http.post<ApiResponse<StudentDto>>(this.url, request);
    }

    /**
     * Actualiza un estudiante existente
     * @param request Datos del estudiante a actualizar
     * @returns Observable con ApiResponse
     */
    updateStudent(request: UpdateStudentRequest): Observable<ApiResponse<StudentDto>> {
      return this.http.put<ApiResponse<StudentDto>>(`${this.url}/${request.id}`, request);
    }

    /**
     * Elimina un estudiante existente
     * @param id ID del estudiante a eliminar
     * @returns Observable con la respuesta de la API
     */
    deleteStudent(id: number): Observable<ApiResponse<any>> {
      return this.http.delete<ApiResponse<any>>(`${this.url}/${id}`);
    }
}