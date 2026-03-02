import { CreateExerciseSessionDto } from './create-exercise-session-dto.model';

export interface CreateTrainingSessionDto {
  heating?: string;
  title: string;
  numberSession: number;
  daySession?: number;
  notes?: string;
  exerciseSessions: CreateExerciseSessionDto[];
}
