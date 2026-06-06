import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { StudentService } from '../../services/student.service';
import { StudentDto } from '../../models/student.model';
import { ApiResponse } from '../../models/api-response.model';
import { AlertService } from '../../services/alert.service';
import { PlanificationsService } from '../../services/planifications.service';
import { PlanningWithMicrocyclesDto } from '../../models/planning-with-microcycles.model';
import { Button } from '../../components/button/button';
import { FormPlanningComponent } from '../../components/form-planning/form-planning';
import { CardPlanificationsComponent } from '../../components/card-planifications/card-planifications';
import { StorageService } from '../../services/storage.service';
import { PlanPurchaseService } from '../../services/plan-purchase.service';
import { CreatePlanPurchase } from '../../models/plan-purchase/create-plan-purchase.model';
import { CreatePlanPurchaseResult } from '../../models/plan-purchase/create-plan-purchase-result.model';

@Component({
  selector: 'app-planifications',
  imports: [CommonModule, Button, FormPlanningComponent, CardPlanificationsComponent],
  templateUrl: './planifications.html',
  styleUrl: './planifications.scss',
})
export class Planifications implements OnInit {
  student = signal<StudentDto | null>(null);
  loading = signal<boolean>(true);
  plannings = signal<PlanningWithMicrocyclesDto[]>([]);
  loadingPlannings = signal<boolean>(true);
  showFormModal = signal<boolean>(false);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private studentService: StudentService,
    private alertService: AlertService,
    private planificationsService: PlanificationsService,
    private storageService: StorageService,
    private planPurchaseService: PlanPurchaseService
  ) {}

  ngOnInit(): void {
    const userData = this.storageService.getUserData();
    const role = userData?.roleName;

    if (role === 'STUDENT') {
      const userId = userData?.userId;
      if (userId) {
        this.loadStudentByUserId(userId, role);
      } else {
        this.alertService.showError('No se encontró el ID del usuario');
        this.loading.set(false);
      }
    } else {
      const id = this.route.snapshot.paramMap.get('id');
      if (id) {
        this.loadStudentByUserId(+id, role);
      } else {
        this.alertService.showError('ID del estudiante no encontrado');
        this.loading.set(false);
      }
    }
  }

  private loadStudentByUserId(userId: number, role: string): void {
    const result = role === 'STUDENT'
      ? this.studentService.getStudentByUserId(userId)
      : this.studentService.getStudentById(userId);

    result.subscribe({
      next: (response: ApiResponse<StudentDto>) => {
        this.loading.set(false);
        if (response.success && response.data) {
          this.student.set(response.data);
          this.loadPlannings(response.data.id);
        } else {
          this.alertService.showError(response.message || 'Error al cargar el estudiante');
        }
      },
      error: () => {
        this.loading.set(false);
        this.alertService.showError('Error de conexión. Verifica tu conexión a internet.');
      }
    });
  }

  private loadPlannings(studentId: number): void {
    this.loadingPlannings.set(true);

    this.planificationsService.getPlanningsByStudentId(studentId).subscribe({
      next: (response: ApiResponse<PlanningWithMicrocyclesDto[]>) => {
        this.loadingPlannings.set(false);
        if (response.success && response.data) {
          this.plannings.set(response.data);
        } else {
          this.alertService.showError(response.message || 'Error al cargar las planificaciones');
        }
      },
      error: () => {
        this.loadingPlannings.set(false);
        this.alertService.showError('Error de conexión. Verifica tu conexión a internet.');
      }
    });
  }

  openFormModal(): void {
    this.showFormModal.set(true);
  }

  formatDate(date: Date | string | null | undefined): string {
    if (!date) return '';
    const d = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(d.getTime())) return '';
    const day = d.getDate().toString().padStart(2, '0');
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  }

  closeFormModal(): void {
    this.showFormModal.set(false);
    const studentId = this.student()?.id;
    if (studentId) {
      this.loadPlannings(studentId);
    }
  }

  onDeletePlanning(planning: PlanningWithMicrocyclesDto): void {
    console.log('Eliminar planificación:', planning);
    this.alertService.showSuccess('Función en desarrollo');
  }

  onViewDetails(planning: PlanningWithMicrocyclesDto): void {
    const studentId = this.student()?.id;
    if (studentId) {
      this.router.navigate([`/atletas/planificaciones/${studentId}/detalles`], {
        state: { planning }
      });
    }
  }

  onGoToPayment(planning: PlanningWithMicrocyclesDto): void {
    const userData = this.storageService.getUserData();
    if (!planning || !userData?.userId) {
      this.alertService.showError('No se pudo obtener la información necesaria para el pago');
      return;
    }

    const request: CreatePlanPurchase = {
      studentId: userData.userId,
      coachId: planning.coachId,
      planId: planning.id,
      paymentMethod: 'MERCADO_PAGO'
    };

    this.planPurchaseService.create(request).subscribe({
      next: (response: ApiResponse<CreatePlanPurchaseResult>) => {
        if (response.success) {
          this.alertService.showSuccess('Compra registrada exitosamente');
        } else {
          this.alertService.showError(response.message || 'Error al registrar la compra');
        }
      },
      error: () => {
        this.alertService.showError('Error de conexión al registrar la compra');
      }
    });
  }
}
