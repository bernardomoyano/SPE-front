import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTableComponent, TableConfig } from '../../components/data-table/data-table';
import { Button } from '../../components/button/button';
import { StudentFiltersComponent } from '../../components/student-filters/student-filters';
import { FormStudentComponent } from '../../components/form-student/form-student';
import { ConfirmationComponent } from '../../components/confirmation/confirmation';
import { StudentService } from '../../services/student.service';
import { StudentDto } from '../../models/student.model';
import { ApiResponse } from '../../models/api-response.model';
import { PaginatedResponse } from '../../models/paginated-response.model';
import { StudentFilters } from '../../models/student-filters.model';
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'app-my-students',
  imports: [CommonModule, DataTableComponent, Button, StudentFiltersComponent, FormStudentComponent, ConfirmationComponent],
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
      { key: 'userName', label: 'Nombre', sortable: true },
      { key: 'email', label: 'Email', sortable: true },
      { key: 'dateOfBirthFormatted', label: 'Fecha de Nacimiento', sortable: true },
      { key: 'phone', label: 'Teléfono', sortable: false },
      { key: 'gender', label: 'Género', sortable: false }
    ],
    actions: [
      {
        label: 'Editar',
        icon: 'pi pi-pencil',
        color: 'success',
        action: (student: StudentDto) => this.editStudent(student)
      },
      {
        label: 'Eliminar',
        icon: 'pi pi-trash',
        color: 'danger',
        action: (student: StudentDto) => this.deleteStudent(student)
      }
    ],
    showPagination: true,
    pageSize: 10,
    emptyMessage: 'No se encontraron atletas',
    showCardsOnMobile: true,
    cardTitleKey: 'userName',
    cardSubtitleKey: 'email',
    cardDescriptionKeys: ['phone', 'gender']
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
          // Formatear las fechas para display
          const formattedData = response.data.data.map(student => ({
            ...student,
            dateOfBirthFormatted: this.formatDate(student.dateOfBirth)
          }));
          this.students.set(formattedData);
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
    // Mapear dateOfBirthFormatted a dateOfBirth para el backend
    const sortBy = sort.column === 'dateOfBirthFormatted' ? 'dateOfBirth' : sort.column;
    this.filters.sortBy = sortBy;
    this.filters.sortDescending = sort.direction === 'desc';
    this.filters.pageNumber = 1; // Reset to first page
    this.loadStudents();
  }

  editStudent(student: StudentDto): void {
    this.studentToEdit.set(student);
    this.showFormModal.set(true);
  }

  deleteStudent(student: StudentDto): void {
    this.studentToDelete.set(student);
    this.showDeleteConfirmation.set(true);
  }

  confirmDelete(): void {
    const student = this.studentToDelete();
    if (!student || !student.id) {
      this.alertService.showError('ID del estudiante no encontrado');
      this.closeDeleteConfirmation();
      return;
    }

    this.deleting.set(true);
    this.studentService.deleteStudent(student.id).subscribe({
      next: (response: ApiResponse<any>) => {
        this.deleting.set(false);
        if (response.success) {
          this.alertService.showSuccess(response.message || 'Estudiante eliminado exitosamente');
          this.loadStudents(); // Recargar la lista después de eliminar
          this.closeDeleteConfirmation();
        } else {
          this.alertService.showError(response.message || 'Error al eliminar el estudiante');
          this.closeDeleteConfirmation();
        }
      },
      error: () => {
        this.deleting.set(false);
        this.alertService.showError('Error al eliminar el estudiante');
        this.closeDeleteConfirmation();
      }
    });
  }

  cancelDelete(): void {
    this.closeDeleteConfirmation();
  }

  closeDeleteConfirmation(): void {
    this.showDeleteConfirmation.set(false);
    this.studentToDelete.set(null);
    this.deleting.set(false);
  }

  private formatDate(date: Date | string | null | undefined): string {
    if (!date) return '';

    const d = typeof date === 'string' ? new Date(date) : date;

    if (isNaN(d.getTime())) return '';

    const day = d.getDate().toString().padStart(2, '0');
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const year = d.getFullYear();

    return `${day}/${month}/${year}`;
  }

  openFormModal(): void {
    this.studentToEdit.set(null);
    this.showFormModal.set(true);
  }

  closeFormModal(): void {
    this.showFormModal.set(false);
    this.studentToEdit.set(null);
    this.loadStudents(); // Recargar la lista después de crear/editar un estudiante
  }
}