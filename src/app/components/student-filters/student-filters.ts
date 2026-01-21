import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormControl } from '@angular/forms';
import { SelectComponent } from '../select/select';
import { InputComponent } from '../input/input';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-student-filters',
  imports: [CommonModule, ReactiveFormsModule, SelectComponent, InputComponent],
  templateUrl: './student-filters.html',
  styleUrl: './student-filters.scss',
})
export class StudentFiltersComponent implements OnInit {
  @Output() filterChange = new EventEmitter<any>();

  filtersForm: FormGroup;

  genderOptions = [
    { value: '', label: 'Todos los géneros' },
    { value: 'Masculino', label: 'Masculino' },
    { value: 'Femenino', label: 'Femenino' }
  ];

  constructor(private fb: FormBuilder) {
    this.filtersForm = this.fb.group({
      searchTerm: [''],
      gender: ['']
    });
  }

  ngOnInit(): void {
    this.setupFilterListeners();
  }

  get searchTermControl() {
    return this.filtersForm.get('searchTerm') as FormControl;
  }

  get genderControl() {
    return this.filtersForm.get('gender') as FormControl;
  }

  get hasActiveFilters(): boolean {
    return !!(this.filtersForm.get('searchTerm')?.value || this.filtersForm.get('gender')?.value);
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
    this.filtersForm.get('gender')?.valueChanges.subscribe(() => this.emitFilters());
  }

  emitFilters(): void {
    const filters = {
      searchTerm: this.filtersForm.get('searchTerm')?.value || undefined,
      gender: this.filtersForm.get('gender')?.value || undefined
    };
    this.filterChange.emit(filters);
  }

  clearFilters(): void {
    this.filtersForm.reset();
    this.emitFilters();
  }
}