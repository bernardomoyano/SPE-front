export interface ManualPaymentEvidence {
  id: string;
  paymentId: string;
  fileUrl: string;
  fileName: string;
  fileType?: string;
  fileSize?: number;
  uploadedBy: string;
  uploadedAt: Date;
  notes?: string;
  isActive: boolean;
}

export interface ManualPaymentReviewItem {
  paymentId: string;
  planPurchaseId: string;
  planningId?: number;
  planningName?: string;
  planningType?: string;
  planningStartDate?: Date;
  planningDurationWeeks?: number;
  studentName?: string;
  studentId?: string;
  amount: number;
  currency: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  evidences: ManualPaymentEvidence[];
}

export interface ReviewManualPaymentRequest {
  reviewedBy: string;
  comment?: string;
}
