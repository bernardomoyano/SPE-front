import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/api-response.model';
import { TrainingTemplate, TrainingTemplateSummary, UpsertTrainingTemplate } from '../models/training-template/training-template.model';

@Injectable({
  providedIn: 'root'
})
export class TrainingTemplateService {
  private readonly url = 'https://localhost:7281/api/TrainingTemplates';

  constructor(private http: HttpClient) {}

  getSummaries(): Observable<ApiResponse<TrainingTemplateSummary[]>> {
    return this.http.get<ApiResponse<TrainingTemplateSummary[]>>(`${this.url}/summaries`);
  }

  getAll(): Observable<ApiResponse<TrainingTemplate[]>> {
    return this.http.get<ApiResponse<TrainingTemplate[]>>(this.url);
  }

  getById(id: number): Observable<ApiResponse<TrainingTemplate>> {
    return this.http.get<ApiResponse<TrainingTemplate>>(`${this.url}/${id}`);
  }

  create(request: UpsertTrainingTemplate): Observable<ApiResponse<number>> {
    return this.http.post<ApiResponse<number>>(this.url, request);
  }

  update(id: number, request: UpsertTrainingTemplate): Observable<ApiResponse<object>> {
    return this.http.put<ApiResponse<object>>(`${this.url}/${id}`, request);
  }

  delete(id: number): Observable<ApiResponse<object>> {
    return this.http.delete<ApiResponse<object>>(`${this.url}/${id}`);
  }
}


