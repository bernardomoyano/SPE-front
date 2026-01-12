import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MyExercises } from './my-exercises';

describe('MyExercises', () => {
  let component: MyExercises;
  let fixture: ComponentFixture<MyExercises>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyExercises]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyExercises);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
