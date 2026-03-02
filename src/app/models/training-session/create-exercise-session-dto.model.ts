export interface CreateExerciseSessionDto {
  exerciseId: number;
  sortOrder: number;
  observation?: string;
  keyPoints?: string;
  sets: number;
  reps: string;
  restSec: number;
}
