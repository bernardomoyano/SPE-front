export interface ExerciseGroupDto {
  id: number;
  trainingSessionId: number;
  type: string;
  name?: string;
  sortOrder?: number;
  rounds?: number;
  restBetweenExercisesSec?: number;
  restBetweenRoundsSec: number;
}