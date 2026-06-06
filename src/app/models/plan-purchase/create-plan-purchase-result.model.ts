export interface CreatePlanPurchaseResult {
  id: string;
  name: string;
  amount: number;
  status: string;
  paymentMethodSelected: string;
  paymentId?: string;
  createdAt: Date;
  updatedAt: Date;
}
