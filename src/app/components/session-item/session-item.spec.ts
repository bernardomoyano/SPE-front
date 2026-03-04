import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SessionItemComponent, TrainingSessionData } from './session-item';

describe('SessionItemComponent', () => {
  let component: SessionItemComponent;
  let fixture: ComponentFixture<SessionItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SessionItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SessionItemComponent);
    component = fixture.componentInstance;
    
    const mockSession: TrainingSessionData = {
      heating: 'Test heating',
      title: 'Test session',
      notes: 'Test notes',
      numberSession: 1
    };
    
    component.session = mockSession;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle collapse state', () => {
    expect(component.isCollapsed()).toBe(false);
    component.toggleCollapse();
    expect(component.isCollapsed()).toBe(true);
  });

  it('should enable edit mode', () => {
    component.isEditing.set(false);
    component.enableEdit();
    expect(component.isEditing()).toBe(true);
  });

  it('should emit save event', () => {
    spyOn(component.save, 'emit');
    component.saveChanges();
    expect(component.save.emit).toHaveBeenCalled();
  });

  it('should emit delete event', () => {
    spyOn(component.delete, 'emit');
    component.onDelete();
    expect(component.delete.emit).toHaveBeenCalled();
  });
});
