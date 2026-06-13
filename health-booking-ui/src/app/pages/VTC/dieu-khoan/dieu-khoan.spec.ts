import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DieuKhoan } from './dieu-khoan';

describe('DieuKhoan', () => {
  let component: DieuKhoan;
  let fixture: ComponentFixture<DieuKhoan>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DieuKhoan],
    }).compileComponents();

    fixture = TestBed.createComponent(DieuKhoan);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
