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
import {
  ManualPaymentReviewItem,
  ReviewManualPaymentRequest
} from '../models/plan-purchase/manual-payment-review.model';
import { PlanPurchaseDto } from '../models/plan-purchase.model';

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

  getManualReviewQueue(payeeId: string): Observable<ApiResponse<ManualPaymentReviewItem[]>> {
    return this.http.get<ApiResponse<ManualPaymentReviewItem[]>>(
      `${this.url}/manual/review-queue`,
      { params: { payeeId } }
    );
  }

  approveManualPayment(
    paymentId: string,
    request: ReviewManualPaymentRequest
  ): Observable<ApiResponse<PlanPurchaseDto>> {
    return this.http.post<ApiResponse<PlanPurchaseDto>>(
      `${this.url}/${paymentId}/manual/approve`,
      request
    );
  }

  rejectManualPayment(
    paymentId: string,
    request: ReviewManualPaymentRequest
  ): Observable<ApiResponse<PlanPurchaseDto>> {
    return this.http.post<ApiResponse<PlanPurchaseDto>>(
      `${this.url}/${paymentId}/manual/reject`,
      request
    );
  }
}
