import { ExerciseGroupDto } from "../exerciseGroup/exercise-group-dto.model";

export interface ExerciseSession {
  id?: number;  // Opcional para crear nuevos
  exerciseId: number;
  exerciseName?: string;  // Solo en GET
  sortOrder: number;
  observation?: string;
  keyPoints?: string;
  sets: number;
  reps: string;
  restSec: number;
  group?: ExerciseGroupDto | null;
}