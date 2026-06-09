export interface PlanPurchaseDto {
  id: string;
  name: string;
  amount: number;
  status: string;
  paymentMethodSelected: string;
  paymentId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PlanPurchaseHistoryItem {
  planPurchaseId: string;
  paymentId?: string;
  status: string;
  paymentMethodSelected: string;
  amount: number;
  createdAt: Date;
  updatedAt: Date;
  planningId?: number;
  planningName?: string;
  planningType?: string;
  planningStartDate?: Date;
  planningDurationWeeks?: number;
  coachId: number;
  coachName?: string;
  studentId: number;
  studentName?: string;
}

export interface PaymentDocumentLink {
  paymentId: string;
  method: string;
  documentType: string;
  label: string;
  url?: string;
  fileName?: string;
  fileType?: string;
}

export interface MercadoPagoReceipt {
  paymentId: string;
  mercadoPagoPaymentId: string;
  status?: string;
  statusDetail?: string;
  dateCreated?: Date;
  dateApproved?: Date;
  dateLastUpdated?: Date;
  paymentMethodId?: string;
  paymentTypeId?: string;
  currencyId?: string;
  description?: string;
  externalReference?: string;
  transactionAmount?: number;
  installments?: number;
  payerEmail?: string;
}
