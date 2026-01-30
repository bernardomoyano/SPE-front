import { Component, OnInit, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { SelectComponent } from '../select/select';
import { InputComponent } from '../input/input';
import { Button } from '../button/button';
import { MuscleGroupsService } from '../../services/muscle-groups.service';
import { AlertService } from '../../services/alert.service';
import { MuscleGroup } from '../../models/muscle-group.model';
import { ApiResponse } from '../../models/api-response.model';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-exercise-filters',
  imports: [CommonModule, ReactiveFormsModule, SelectComponent, InputComponent, Button],
  templateUrl: './exercise-filters.html',
  styleUrl: './exercise-filters.scss',
})
export class ExerciseFiltersComponent implements OnInit {
  @Output() filterChange = new EventEmitter<any>();

  filtersForm: FormGroup;
  muscleGroups = signal<MuscleGroup[]>([]);
  loading = signal<boolean>(false);

  commonOptions = [
    { value: '', label: 'Todos' },
    { value: 'true', label: 'Comunes' },
    { value: 'false', label: 'Personalizados' }
  ];

  constructor(
    private fb: FormBuilder,
    private muscleGroupsService: MuscleGroupsService,
    private alertService: AlertService
  ) {
    this.filtersForm = this.fb.group({
      searchTerm: [''],
      muscleGroupId: [''],
      isCommon: ['']
    });
  }

  ngOnInit(): void {
    this.loadMuscleGroups();
    this.setupFilterListeners();
  }

  loadMuscleGroups(): void {
    this.loading.set(true);
    this.muscleGroupsService.getMuscleGroups().subscribe({
      next: (response: ApiResponse<MuscleGroup[]>) => {
        if (response.success && response.data) {
          this.muscleGroups.set(response.data);
        } else {
          this.alertService.showError(response.message || 'Error al cargar grupos musculares');
        }
        this.loading.set(false);
      },
      error: () => {
        this.alertService.showError('Error al cargar grupos musculares');
        this.loading.set(false);
      }
    });
  }

  get muscleGroupOptions() {
    return [
      { value: '', label: 'Todos los grupos' },
      ...this.muscleGroups().map(group => ({
        value: group.id,
        label: group.name
      }))
    ];
  }

  setupFilterListeners(): void {
    // Búsqueda con debounce
    this.filtersForm.get('searchTerm')?.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged()
      )
      .subscribe(() => this.emitFilters());

    // Filtros instantáneos
    this.filtersForm.get('muscleGroupId')?.valueChanges.subscribe(() => this.emitFilters());
    this.filtersForm.get('isCommon')?.valueChanges.subscribe(() => this.emitFilters());
  }

  emitFilters(): void {
    const filters = {
      searchTerm: this.filtersForm.get('searchTerm')?.value || undefined,
      muscleGroupId: this.filtersForm.get('muscleGroupId')?.value || undefined,
      isCommon: this.filtersForm.get('isCommon')?.value === '' ? undefined : 
                this.filtersForm.get('isCommon')?.value === 'true'
    };
    this.filterChange.emit(filters);
  }

  clearFilters(): void {
    this.filtersForm.reset({
      searchTerm: '',
      muscleGroupId: '',
      isCommon: ''
    });
    this.emitFilters();
  }

  get hasActiveFilters(): boolean {
    const values = this.filtersForm.value;
    return !!(values.searchTerm || values.muscleGroupId || values.isCommon);
  }

  get muscleGroupControl(): FormControl {
    return this.filtersForm.get('muscleGroupId') as FormControl;
  }

  get isCommonControl(): FormControl {
    return this.filtersForm.get('isCommon') as FormControl;
  }

  get searchTermControl(): FormControl {
    return this.filtersForm.get('searchTerm') as FormControl;
  }
}