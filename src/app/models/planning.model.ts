export interface PlanningDto {
  id: number;
  studentId: number;
  studentName?: string;
  coachId?: number;
  coachName: string;
  name?: string;
  goals?: string;
  phase?: string;
  startDate: Date;
  durationWeeks: number;
  endDate?: Date; // Calculated as StartDate + DurationWeeks * 7 days
  status: 'active' | 'paused' | 'finished';
  type: 'training' | 'nutrition' | 'complete';
  notes?: string;
}

export interface PlanningFilters {
  pageNumber: number;
  pageSize: number;
  sortBy: string;
  sortDescending: boolean;
  searchTerm?: string;
  status?: 'active' | 'paused' | 'finished';
  type?: 'training' | 'nutrition' | 'complete';
  studentId?: number;
}