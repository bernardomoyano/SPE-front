import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardCoach } from './dashboard-coach';

describe('DashboardCoach', () => {
  let component: DashboardCoach;
  let fixture: ComponentFixture<DashboardCoach>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardCoach]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardCoach);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
