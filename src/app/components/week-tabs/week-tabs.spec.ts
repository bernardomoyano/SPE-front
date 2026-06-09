import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WeekTabsComponent } from './week-tabs';

describe('WeekTabsComponent', () => {
  let component: WeekTabsComponent;
  let fixture: ComponentFixture<WeekTabsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WeekTabsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WeekTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should generate correct number of weeks', () => {
    component.totalWeeks = 4;
    fixture.detectChanges();
    expect(component.weeks.length).toBe(4);
  });

  it('should emit weekChange event when week is selected', () => {
    spyOn(component.weekChange, 'emit');
    component.selectWeek(2);
    expect(component.weekChange.emit).toHaveBeenCalledWith(2);
  });
});
