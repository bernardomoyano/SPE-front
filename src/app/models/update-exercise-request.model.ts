export interface UpdateExerciseRequest {
  exerciseId: number;
  coachId: number;
  name: string;
  description: string;
  linkVideo: string;
  muscleGroupId: number;
}