import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTableComponent, TableConfig, TableAction } from '../../components/data-table/data-table';
import { ExerciseService } from '../../services/exercise.service';
import { Exercise } from '../../models/exercise.model';
import { ApiResponse } from '../../models/api-response.model';
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'app-my-exercises',
  imports: [CommonModule, DataTableComponent],
  templateUrl: './my-exercises.html',
  styleUrl: './my-exercises.scss',
})
export class MyExercises implements OnInit {
  exercises = signal<Exercise[]>([]);
  loading = signal<boolean>(false);
  currentPage = signal<number>(1);
  totalItems = signal<number>(0);

  tableConfig: TableConfig = {
    columns: [
      { key: 'name', label: 'Nombre', sortable: true },
      { key: 'description', label: 'Descripción', sortable: false },
      { key: 'muscleGroupName', label: 'Grupo Muscular', sortable: true },
      { key: 'linkVideo', label: 'Video', sortable: false, width: '120px' },
      { key: 'isCommon', label: 'Común', sortable: true, width: '80px' }
    ],
    actions: [
      {
        label: 'Editar',
        icon: 'pi pi-pencil',
        color: 'success',
        action: (exercise: Exercise) => this.editExercise(exercise)
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
    emptyMessage: 'No tienes ejercicios registrados aún',
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

    this.exerciseService.getMyExercises().subscribe({
      next: (response: ApiResponse<Exercise[]>) => {
        
        this.loading.set(false);

        if (response.success && response.data) {
          this.exercises.set(response.data);
          this.totalItems.set(response.data.length);
        } else {
          this.alertService.showError(response.message || 'Error al obtener ejercicios');
        }
      },
      error: (error) => {
        this.loading.set(false);
        this.alertService.showError('Error de conexión. Verifica tu conexión a internet.');
      }
    });
  }

  onPageChange(page: number): void {
    this.currentPage.set(page);
    // Aquí irá la lógica de paginación cuando se implemente en el backend
  }

  onSortChange(sort: { column: string; direction: 'asc' | 'desc' }): void {
    // Aquí irá la lógica de ordenamiento cuando se implemente en el backend
    console.log('Ordenar por:', sort);
  }

  editExercise(exercise: Exercise): void {
    // TODO: Implementar navegación a edición de ejercicio
    console.log('Editar ejercicio:', exercise);
    this.alertService.showSuccess(`Funcionalidad de edición próximamente - ${exercise.name}`);
  }

  deleteExercise(exercise: Exercise): void {
    // TODO: Implementar eliminación de ejercicio
    console.log('Eliminar ejercicio:', exercise);
    this.alertService.showError(`Funcionalidad de eliminación próximamente - ${exercise.name}`);
  }
}
