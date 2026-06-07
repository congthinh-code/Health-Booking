import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QTHP } from './qthp';

describe('QTHP', () => {
  let component: QTHP;
  let fixture: ComponentFixture<QTHP>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QTHP],
    }).compileComponents();

    fixture = TestBed.createComponent(QTHP);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
