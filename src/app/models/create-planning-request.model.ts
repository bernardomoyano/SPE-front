export interface CreatePlanningRequest {
  studentId: number;
  coachId: number; // Se obtiene del token
  name?: string;
  goals?: string;
  phase?: string;
  startDate: Date;
  durationWeeks: number;
  price: number;
  status: 'active' | 'paused' | 'finished';
  type: 'training' | 'nutrition' | 'complete';
  notes?: string;
}

export interface UpdatePlanningRequest extends CreatePlanningRequest {
  id: number;
}
