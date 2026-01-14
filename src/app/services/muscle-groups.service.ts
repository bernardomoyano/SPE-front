import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { MuscleGroup } from '../models/muscle-group.model';
import { ApiResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class MuscleGroupsService {
  private readonly url = 'https://localhost:7281/api/MuscleGroups';

  constructor(private http: HttpClient) {}

  /**
   * Obtiene la lista de grupos musculares
   * @returns Observable con ApiResponse que contiene la lista de grupos musculares
   */
  getMuscleGroups(): Observable<ApiResponse<MuscleGroup[]>> {
    return this.http.get<ApiResponse<MuscleGroup[]>>(this.url);
  }
}