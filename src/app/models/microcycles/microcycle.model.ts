import { TrainingSession } from "../training-session/training-session.model";

export interface Microcycle {
  id?: number;
  planningId?: number;
  weekNumber?: number;
  notes?: string;
  trainingSessions: TrainingSession[];
}