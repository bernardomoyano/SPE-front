import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentFiltersComponent } from './student-filters';

describe('StudentFiltersComponent', () => {
  let component: StudentFiltersComponent;
  let fixture: ComponentFixture<StudentFiltersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentFiltersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});