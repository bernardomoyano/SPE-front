export interface CreatePlanPurchaseResult {
  planPurchaseId: string;
  paymentId: string;
  checkoutUrl: string;
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
