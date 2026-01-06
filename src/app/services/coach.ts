import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CoachRegisterRequest } from '../models/coach.model';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root',
})
export class Coach {
  private apiUrl = 'https://localhost:7281/api/Coaches';

  constructor(private http: HttpClient) {}

  registerCoach(data: CoachRegisterRequest): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(this.apiUrl, data);
  }
}
