export interface CreateExerciseRequest {
  name: string;
  description: string;
  linkVideo: string;
  muscleGroupId: number;
  coachId: number;
}