export interface ExerciseFilters {
  pageNumber: number;
  pageSize: number;
  sortBy: string;
  sortDescending: boolean;
  searchTerm?: string;
  isCommon?: boolean;
  muscleGroupId?: number;
}