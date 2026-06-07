import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QTDK } from './qtdk';

describe('QTDK', () => {
  let component: QTDK;
  let fixture: ComponentFixture<QTDK>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QTDK],
    }).compileComponents();

    fixture = TestBed.createComponent(QTDK);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
