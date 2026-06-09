import { ExerciseSession } from "./exercise-session.model";

export interface TrainingSession {
  id?: number;  // Opcional para crear nuevos
  heating?: string;
  title: string;
  numberSession: number;
  daySession?: number;
  notes?: string;
  exerciseSessions: ExerciseSession[];
}