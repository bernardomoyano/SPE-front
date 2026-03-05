export interface CreateExerciseGroupDto {
  trainingSessionId: number;
  rounds: number | null;
  restBetweenRoundsSec: number;
  exerciseSessionIds: number[];
}