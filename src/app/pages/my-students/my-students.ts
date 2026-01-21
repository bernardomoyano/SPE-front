import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTableComponent, TableConfig } from '../../components/data-table/data-table';
import { Button } from '../../components/button/button';
import { StudentFiltersComponent } from '../../components/student-filters/student-filters';
import { StudentService } from '../../services/student.service';
import { StudentDto } from '../../models/student.model';
import { ApiResponse } from '../../models/api-response.model';
import { PaginatedResponse } from '../../models/paginated-response.model';
import { StudentFilters } from '../../models/student-filters.model';
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'app-my-students',
  imports: [CommonModule, DataTableComponent, Button, StudentFiltersComponent],
  templateUrl: './my-students.html',
  styleUrl: './my-students.scss',
})
export class MyStudents implements OnInit {
  students = signal<StudentDto[]>([]);
  loading = signal<boolean>(false);
  totalItems = signal<number>(0);
  showFormModal = signal<boolean>(false);
  studentToEdit = signal<StudentDto | null>(null);
  showDeleteConfirmation = signal<boolean>(false);
  studentToDelete = signal<StudentDto | null>(null);
  deleting = signal<boolean>(false);

  filters: StudentFilters = {
    pageNumber: 1,
    pageSize: 10,
    sortBy: 'userName',
    sortDescending: false
  };

  tableConfig: TableConfig = {
    columns: [
      { key: 'userName', label: 'Nombre de Usuario', sortable: true },
      { key: 'email', label: 'Email', sortable: true },
      { key: 'dateOfBirth', label: 'Fecha de Nacimiento', sortable: true },
      { key: 'gender', label: 'Género', sortable: false },
      { key: 'heightCm', label: 'Altura (cm)', sortable: false },
      { key: 'weightKg', label: 'Peso (kg)', sortable: false },
      { key: 'trainingLevel', label: 'Nivel de Entrenamiento', sortable: false },
      { key: 'phone', label: 'Teléfono', sortable: false },
      { key: 'country', label: 'País', sortable: false },
      { key: 'coachName', label: 'Entrenador', sortable: false }
    ],
    actions: [],
    showPagination: true,
    pageSize: 10,
    emptyMessage: 'No se encontraron atletas',
    showCardsOnMobile: true,
    cardTitleKey: 'userName',
    cardSubtitleKey: 'email',
    cardDescriptionKeys: ['trainingLevel', 'country']
  };

  constructor(
    private studentService: StudentService,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.loadStudents();
  }

  loadStudents(): void {
    this.loading.set(true);
    

    this.studentService.getMyStudents(this.filters).subscribe({
      next: (response: ApiResponse<PaginatedResponse<StudentDto>>) => {
        this.loading.set(false);

        if (response.success && response.data) {
          this.students.set(response.data.data);
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

  onFilterChange(filterUpdates: any): void {
    this.filters.searchTerm = filterUpdates.searchTerm;
    this.filters.gender = filterUpdates.gender;
    this.filters.pageNumber = 1; // Reset to first page
    this.loadStudents();
  }

  onPageChange(page: number): void {
    this.filters.pageNumber = page;
    this.loadStudents();
  }

  onSortChange(sort: { column: string; direction: 'asc' | 'desc' }): void {
    this.filters.sortBy = sort.column;
    this.filters.sortDescending = sort.direction === 'desc';
    this.filters.pageNumber = 1; // Reset to first page
    this.loadStudents();
  }

  openFormModal(): void {
    // TODO: Implementar modal para nuevo atleta
    console.log('Abrir modal para nuevo atleta');
  }
}