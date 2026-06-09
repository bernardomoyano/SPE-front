import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetailsPlanifications } from './details-planifications';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

describe('DetailsPlanifications', () => {
  let component: DetailsPlanifications;
  let fixture: ComponentFixture<DetailsPlanifications>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockLocation: jasmine.SpyObj<Location>;

  beforeEach(async () => {
    mockRouter = jasmine.createSpyObj('Router', ['getCurrentNavigation']);
    mockLocation = jasmine.createSpyObj('Location', ['back', 'getState']);

    await TestBed.configureTestingModule({
      imports: [DetailsPlanifications],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: Location, useValue: mockLocation }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailsPlanifications);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should format date correctly', () => {
    const date = new Date('2024-03-15');
    expect(component.formatDate(date)).toBe('15/03/2024');
  });

  it('should return correct status label', () => {
    expect(component.getStatusLabel('active')).toBe('Activo');
    expect(component.getStatusLabel('paused')).toBe('Pausado');
    expect(component.getStatusLabel('finished')).toBe('Finalizado');
  });

  it('should update active week', () => {
    component.onWeekChange(3);
    expect(component.activeWeek()).toBe(3);
  });
});
