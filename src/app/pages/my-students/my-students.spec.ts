import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyStudents } from './my-students';

describe('MyStudents', () => {
  let component: MyStudents;
  let fixture: ComponentFixture<MyStudents>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyStudents]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyStudents);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});