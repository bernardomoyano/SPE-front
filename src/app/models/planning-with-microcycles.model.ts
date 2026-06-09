import { PlanPurchaseDto } from './plan-purchase.model';

export interface MicrocycleDto {
  id: number;
  planningId: number;
  weekNumber: number;
  notes?: string;
}

export interface PlanningWithMicrocyclesDto {
  id: number;
  studentId: number;
  studentName: string;
  coachId: number;
  coachName: string;
  name?: string;
  goals?: string;
  phase?: string;
  startDate: Date;
  durationWeeks: number;
  endDate: Date; // Calculated as StartDate + DurationWeeks * 7 days
  status: 'active' | 'paused' | 'finished';
  type: 'training' | 'nutrition' | 'complete';
  notes?: string;
  price: number;
  purchase?: PlanPurchaseDto;
  microcycles: MicrocycleDto[];
}

