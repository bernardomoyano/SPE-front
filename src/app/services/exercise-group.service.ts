import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CreateExerciseGroupDto } from '../models/exerciseGroup/create-exercise-group-dto.model';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class ExerciseGroupService {
  private readonly url = 'https://localhost:7281/api/ExerciseGroups';

  constructor(private http: HttpClient) {}

  createExerciseGroup(request: CreateExerciseGroupDto): Observable<ApiResponse<number>> {
    return this.http.post<ApiResponse<number>>(this.url, request);
  }

  deleteExerciseGroup(groupId: number): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.url}/${groupId}`);
  }

}
