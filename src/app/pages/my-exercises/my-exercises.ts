import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTableComponent, TableConfig } from '../../components/data-table/data-table';
import { Button } from '../../components/button/button';
import { FormExerciseComponent } from '../../components/form-exercise/form-exercise';
import { ExerciseFiltersComponent } from '../../components/exercise-filters/exercise-filters';
import { ExerciseService } from '../../services/exercise.service';
import { Exercise } from '../../models/exercise.model';
import { ApiResponse } from '../../models/api-response.model';
import { PaginatedResponse } from '../../models/paginated-response.model';
import { ExerciseFilters } from '../../models/exercise-filters.model';
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'app-my-exercises',
  imports: [CommonModule, DataTableComponent, Button, FormExerciseComponent, ExerciseFiltersComponent],
  templateUrl: './my-exercises.html',
  styleUrl: './my-exercises.scss',
})
export class MyExercises implements OnInit {
  exercises = signal<Exercise[]>([]);
  loading = signal<boolean>(false);
  totalItems = signal<number>(0);
  showFormModal = signal<boolean>(false);
  exerciseToEdit = signal<Exercise | null>(null);

  filters: ExerciseFilters = {
    pageNumber: 1,
    pageSize: 10,
    sortBy: 'name',
    sortDescending: false
  };

  tableConfig: TableConfig = {
    columns: [
      { key: 'name', label: 'Nombre', sortable: true },
      { key: 'description', label: 'Descripción', sortable: false },
      { key: 'muscleGroupName', label: 'Grupo Muscular', sortable: false },
      { key: 'linkVideo', label: 'Video', sortable: false, width: '120px' },
      { key: 'isCommon', label: 'Común', sortable: false, width: '80px' }
    ],
    actions: [
      {
        label: 'Editar',
        icon: 'pi pi-pencil',
        color: 'success',
        action: (exercise: Exercise) => this.editExercise(exercise),
        disabled: (exercise: Exercise) => !!exercise.isCommon
      },
      {
        label: 'Eliminar',
        icon: 'pi pi-trash',
        color: 'danger',
        action: (exercise: Exercise) => this.deleteExercise(exercise)
      }
    ],
    showPagination: true,
    pageSize: 10,
    emptyMessage: 'No se encontraron ejercicios',
    showCardsOnMobile: true,
    cardTitleKey: 'name',
    cardSubtitleKey: 'muscleGroupName',
    cardDescriptionKeys: ['linkVideo', 'isCommon']
  };

  constructor(
    private exerciseService: ExerciseService,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.loadExercises();
  }

  loadExercises(): void {
    this.loading.set(true);
    

    this.exerciseService.getMyExercises(this.filters).subscribe({
      next: (response: ApiResponse<PaginatedResponse<Exercise>>) => {
        this.loading.set(false);

        if (response.success && response.data) {
          this.exercises.set(response.data.data);
          this.totalItems.set(response.data.totalCount);
          this.filters.pageNumber = response.data.pageNumber;
          this.filters.pageSize = response.data.pageSize;
        }
      },
      error: (error) => {
        this.loading.set(false);
        this.alertService.showError('Error de conexión. Verifica tu conexión a internet.');
      }
    });
  }

  onFilterChange(filterValues: any): void {
    this.filters = {
      ...this.filters,
      pageNumber: 1, // Reset to first page on filter change
      searchTerm: filterValues.searchTerm,
      muscleGroupId: filterValues.muscleGroupId,
      isCommon: filterValues.isCommon
    };
    this.loadExercises();
  }

  onPageChange(page: number): void {
    this.filters.pageNumber = page;
    this.loadExercises();
  }

  onSortChange(sort: { column: string; direction: 'asc' | 'desc' }): void {
    this.filters.sortBy = sort.column;
    this.filters.sortDescending = sort.direction === 'desc';
    this.loadExercises();
  }

  editExercise(exercise: Exercise): void {
    this.exerciseToEdit.set(exercise);
    this.showFormModal.set(true);
  }

  deleteExercise(exercise: Exercise): void {
    if (!exercise.id) {
      this.alertService.showError('ID del ejercicio no encontrado');
      return;
    }

    this.exerciseService.deleteExercise(exercise.id).subscribe({
      next: (response: ApiResponse<any>) => {
        if (response.success) {
          this.alertService.showSuccess(response.message || 'Ejercicio eliminado exitosamente');
          this.loadExercises(); // Recargar la lista después de eliminar
        } else {
          this.alertService.showError(response.message || 'Error al eliminar el ejercicio');
        }
      },
      error: () => {
        this.alertService.showError('Error al eliminar el ejercicio');
      }
    });
  }

  openFormModal(): void {
    this.exerciseToEdit.set(null);
    this.showFormModal.set(true);
  }

  closeFormModal(): void {
    this.showFormModal.set(false);
    this.exerciseToEdit.set(null);
    this.loadExercises(); // Recargar la lista después de crear o editar
  }

  get currentPage(): number {
    return this.filters.pageNumber;
  }
}
