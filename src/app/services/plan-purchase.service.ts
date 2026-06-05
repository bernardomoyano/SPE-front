import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/api-response.model';
import { CreatePlanPurchase } from '../models/plan-purchase/create-plan-purchase.model';
import { CreatePlanPurchaseResult } from '../models/plan-purchase/create-plan-purchase-result.model';

@Injectable({
  providedIn: 'root'
})
export class PlanPurchaseService {
  private readonly url = 'https://localhost:7281/api/PlanPurchases';

  constructor(private http: HttpClient) {}

  create(request: CreatePlanPurchase): Observable<ApiResponse<CreatePlanPurchaseResult>> {
    return this.http.post<ApiResponse<CreatePlanPurchaseResult>>(this.url, request);
  }
}
