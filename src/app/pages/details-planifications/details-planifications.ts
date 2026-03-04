import { Component, OnInit, signal, computed, ViewChildren, QueryList, effect } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { PlanningWithMicrocyclesDto } from '../../models/planning-with-microcycles.model';
import { WeekTabsComponent } from '../../components/week-tabs/week-tabs';
import { SessionItemComponent, TrainingSessionData } from '../../components/session-item/session-item';
import { InputComponent } from '../../components/input/input';
import { TrainingSessionService as MicrocycleService } from '../../services/microcycle.service';
import { PlanificationsService } from '../../services/planifications.service';
import { AlertService } from '../../services/alert.service';
import { PlanningDto } from '../../models/planning.model';
import { TrainingSession } from '../../models/training-session/training-session.model';
import { Microcycle } from '../../models/microcycles/microcycle.model';

@Component({
  selector: 'app-details-planifications',
  imports: [CommonModule, ReactiveFormsModule, WeekTabsComponent, SessionItemComponent, InputComponent],
  templateUrl: './details-planifications.html',
  styleUrl: './details-planifications.scss',
})
export class DetailsPlanifications implements OnInit {
  @ViewChildren(SessionItemComponent) sessionItems!: QueryList<SessionItemComponent>;

  planning = signal<PlanningWithMicrocyclesDto | null>(null);
  activeWeek = signal<number>(1);
  isEditingPlanning = signal<boolean>(false);

  // Reactive form for editing planning info
  planningForm: FormGroup;

  get nameControl() { return this.planningForm.get('name') as FormControl; }
  get phaseControl() { return this.planningForm.get('phase') as FormControl; }
  get goalsControl() { return this.planningForm.get('goals') as FormControl; }
  get notesControl() { return this.planningForm.get('notes') as FormControl; }

  // Sessions grouped by week number
  sessionsByWeek = signal<Map<number, TrainingSessionData[]>>(new Map());
  
  // Computed: Get sessions for active week
  activeSessions = computed(() => {
    const week = this.activeWeek();
    return this.sessionsByWeek().get(week) || [];
  });

  // Computed: Get microcycle ID for active week
  activeMicrocycleId = computed(() => {
    const week = this.activeWeek();
    const planning = this.planning();
    
    if (!planning) return 0;
    
    const microcycle = planning.microcycles.find(m => m.weekNumber === week);
    
    return microcycle?.id || 0;
  });
  
  constructor(
    private router: Router,
    private location: Location,
    private fb: FormBuilder,
    private microcycleService: MicrocycleService,
    private planificationsService: PlanificationsService,
    private alertService: AlertService
  ) {
    this.planningForm = this.fb.group({
      name: [''],
      status: [''],
      type: [''],
      phase: [''],
      startDate: [''],
      durationWeeks: [0],
      goals: [''],
      notes: ['']
    });
    // Get planning data from navigation state
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras?.state || this.location.getState() as any;
    
    if (state && state['planning']) {
      this.planning.set(state['planning']);
    }

    // Effect para cargar sesiones cuando cambia la semana activa
    effect(() => {
      const microcycleId = this.activeMicrocycleId();
      const week = this.activeWeek();
      
      if (microcycleId > 0) {
        this.loadMicrocycleSessions(microcycleId, week);
      }
    });
  }

  ngOnInit(): void {
    // If no planning data, redirect back
    if (!this.planning()) {
      this.goBack();
    }
  }

  onWeekChange(week: number): void {
    this.activeWeek.set(week);
  }

  private loadMicrocycleSessions(microcycleId: number, week: number): void {
    this.microcycleService.getMicrocycleById(microcycleId).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          const microcycle = response.data;
          
          // Convertir TrainingSession[] a TrainingSessionData[]
          if (microcycle.trainingSessions && microcycle.trainingSessions.length > 0) {
            const sessions: TrainingSessionData[] = microcycle.trainingSessions.map(ts => ({
              id: ts.id,
              heating: ts.heating || '',
              title: ts.title,
              notes: ts.notes || '',
              numberSession: ts.numberSession
            }));

            // Actualizar el mapa de sesiones
            const updatedMap = new Map(this.sessionsByWeek());
            updatedMap.set(week, sessions);
            this.sessionsByWeek.set(updatedMap);
          } else {
            // Limpiar sesiones de esta semana si no hay
            const updatedMap = new Map(this.sessionsByWeek());
            updatedMap.delete(week);
            this.sessionsByWeek.set(updatedMap);
          }
        }
      },
      error: (error) => {
        console.error('Error al cargar sesiones del microciclo:', error);
      }
    });
  }

  goBack(): void {
    this.location.back();
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

  getStatusLabel(status: string): string {
    const labels: { [key: string]: string } = {
      'active': 'Activo',
      'paused': 'Pausado',
      'finished': 'Finalizado'
    };
    return labels[status] || status;
  }

  getTypeLabel(type: string): string {
    const labels: { [key: string]: string } = {
      'training': 'Entrenamiento',
      'nutrition': 'Nutrición',
      'complete': 'Completo'
    };
    return labels[type] || type;
  }

  private toInputDate(date: Date | string | null | undefined): string {
    if (!date) return '';
    const d = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(d.getTime())) return '';
    const year = d.getFullYear();
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  togglePlanningEdit(): void {
    if (!this.isEditingPlanning()) {
      const p = this.planning();
      this.planningForm.patchValue({
        name: p?.name || '',
        status: p?.status || 'active',
        type: p?.type || 'training',
        phase: p?.phase || '',
        startDate: this.toInputDate(p?.startDate),
        durationWeeks: p?.durationWeeks || 0,
        goals: p?.goals || '',
        notes: p?.notes || ''
      });
    }
    this.isEditingPlanning.set(!this.isEditingPlanning());
  }

  savePlanningChanges(): void {
    const current = this.planning();
    if (!current) return;

    const v = this.planningForm.value;

    const payload: PlanningDto = {
      id: current.id,
      studentId: current.studentId,
      studentName: current.studentName,
      coachId: current.coachId,
      coachName: current.coachName,
      name: v.name || undefined,
      status: v.status,
      type: v.type,
      phase: v.phase || undefined,
      startDate: v.startDate ? new Date(v.startDate) : current.startDate,
      durationWeeks: Number(v.durationWeeks),
      goals: v.goals || undefined,
      notes: v.notes || undefined
    };

    this.planificationsService.updatePlanning(payload).subscribe({
      next: (response) => {
        if (response.success) {
          const updated: PlanningWithMicrocyclesDto = {
            ...current,
            ...payload,
            microcycles: current.microcycles
          };
          this.planning.set(updated);
          this.isEditingPlanning.set(false);
          this.alertService.showSuccess(response.message || 'Planificación actualizada exitosamente');
        } else {
          this.alertService.showError(response.message || 'Error al actualizar la planificación');
        }
      },
      error: (error) => {
        const errorMessage = error?.error?.message || error?.message || 'Error al actualizar la planificación';
        this.alertService.showError(errorMessage);
      }
    });
  }

  addSession(): void {
    const week = this.activeWeek();
    const sessions = this.sessionsByWeek().get(week) || [];
    const newSession: TrainingSessionData = {
      heating: '',
      title: '',
      notes: '',
      numberSession: sessions.length + 1
    };
    
    const updatedMap = new Map(this.sessionsByWeek());
    updatedMap.set(week, [...sessions, newSession]);
    this.sessionsByWeek.set(updatedMap);
  }

  saveSession(index: number, session: TrainingSessionData): void {
    const week = this.activeWeek();
    const sessions = [...(this.sessionsByWeek().get(week) || [])];
    sessions[index] = session;
    
    const updatedMap = new Map(this.sessionsByWeek());
    updatedMap.set(week, sessions);
    this.sessionsByWeek.set(updatedMap);
  }

  deleteSession(index: number): void {
    const week = this.activeWeek();
    const sessions = [...(this.sessionsByWeek().get(week) || [])];
    sessions.splice(index, 1);
    
    // Renumerar las sesiones
    sessions.forEach((session, idx) => {
      session.numberSession = idx + 1;
    });
    
    const updatedMap = new Map(this.sessionsByWeek());
    if (sessions.length > 0) {
      updatedMap.set(week, sessions);
    } else {
      updatedMap.delete(week);
    }
    this.sessionsByWeek.set(updatedMap);
  }

  saveAllSessions(): void {
    const microcycleId = this.activeMicrocycleId();
    const currentMicrocycle = this.planning()?.microcycles.find(m => m.id === microcycleId);
    
    if (!microcycleId) {
      this.alertService.showError('No se ha encontrado el microciclo');
      return;
    }

    // Recolectar todas las sesiones de los componentes hijos
    const trainingSessions = this.sessionItems
      .map(item => item.getTrainingSessionDto())
      .filter((dto): dto is TrainingSession => dto !== null);

    if (trainingSessions.length === 0) {
      this.alertService.showError('No hay sesiones válidas para guardar');
      return;
    }

    const payload: Microcycle = {
      id: microcycleId,
      notes: currentMicrocycle?.notes,
      trainingSessions
    };

    this.microcycleService.updateMicrocycle(microcycleId, payload).subscribe({
      next: (response) => {
        if (response.success) {
          this.alertService.showSuccess(response.message || 'Sesiones guardadas exitosamente');
        } else {
          this.alertService.showError(response.message || 'Error al guardar las sesiones');
        }
      },
      error: (error) => {
        const errorMessage = error?.error?.message || error?.message || 'Error al guardar las sesiones';
        this.alertService.showError(errorMessage);
      }
    });
  }
}
