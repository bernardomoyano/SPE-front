import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/api-response.model';
import { CreatePlanPurchase } from '../models/plan-purchase/create-plan-purchase.model';
import { CreatePlanPurchaseResult } from '../models/plan-purchase/create-plan-purchase-result.model';
import {
  UploadManualPaymentEvidenceRequest,
  UploadManualPaymentEvidenceResult
} from '../models/plan-purchase/upload-manual-payment-evidence.model';

@Injectable({
  providedIn: 'root'
})
export class PlanPurchaseService {
  private readonly url = 'https://localhost:7281/api/PlanPurchases';

  constructor(private http: HttpClient) {}

  create(request: CreatePlanPurchase): Observable<ApiResponse<CreatePlanPurchaseResult>> {
    return this.http.post<ApiResponse<CreatePlanPurchaseResult>>(this.url, request);
  }

  uploadManualEvidence(
    paymentId: string,
    request: UploadManualPaymentEvidenceRequest
  ): Observable<ApiResponse<UploadManualPaymentEvidenceResult>> {
    return this.http.post<ApiResponse<UploadManualPaymentEvidenceResult>>(
      `${this.url}/${paymentId}/manual/evidences`,
      request
    );
  }
}
