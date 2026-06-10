export interface TrainingTemplate {
  id: number;
  coachId: number;
  name: string;
  heating?: string;
  title: string;
  notes?: string;
  exercises: ExerciseTrainingTemplate[];
  groups: ExerciseGroupTrainingTemplate[];
}

export interface ExerciseTrainingTemplate {
  id: number;
  trainingTemplateId: number;
  exerciseId: number;
  exerciseName: string;
  sortOrder: number;
  observation?: string;
  keyPoints?: string;
  groupId?: number;
  group?: ExerciseGroupTrainingTemplate;
  sets: number;
  reps: string;
  restSec: number;
}

export interface ExerciseGroupTrainingTemplate {
  id: number;
  trainingTemplateId: number;
  type: string;
  name?: string;
  sortOrder?: number;
  rounds?: number;
  restBetweenExercisesSec?: number;
  restBetweenRoundsSec: number;
}

export interface UpsertTrainingTemplate {
  name: string;
  heating?: string;
  title: string;
  notes?: string;
  exercises: UpsertExerciseTrainingTemplate[];
  groups: UpsertExerciseGroupTrainingTemplate[];
}

export interface UpsertExerciseTrainingTemplate {
  clientGroupId?: number;
  exerciseId: number;
  sortOrder: number;
  observation?: string;
  keyPoints?: string;
  sets: number;
  reps: string;
  restSec: number;
}

export interface UpsertExerciseGroupTrainingTemplate {
  clientId: number;
  type: string;
  name?: string;
  sortOrder?: number;
  rounds?: number;
  restBetweenExercisesSec?: number;
  restBetweenRoundsSec: number;
}
