export interface StudentFilters {
  pageNumber: number;
  pageSize: number;
  sortBy: string;
  sortDescending: boolean;
  searchTerm?: string;
  gender?: string;
}