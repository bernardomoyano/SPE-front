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
