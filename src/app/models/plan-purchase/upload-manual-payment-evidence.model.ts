export interface UploadManualPaymentEvidenceRequest {
  fileUrl: string;
  fileName: string;
  fileType?: string;
  fileSize?: number;
  uploadedBy: string;
  notes?: string;
}

export interface UploadManualPaymentEvidenceResult {
  paymentId: string;
  evidenceId: string;
  status: string;
  message: string;
  planPurchase?: {
    id: string;
    name: string;
    amount: number;
    status: string;
    paymentMethodSelected: string;
    paymentId?: string;
    createdAt: Date;
    updatedAt: Date;
  };
}
