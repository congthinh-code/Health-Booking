import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CDUD } from './cdud';

describe('CDUD', () => {
  let component: CDUD;
  let fixture: ComponentFixture<CDUD>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CDUD],
    }).compileComponents();

    fixture = TestBed.createComponent(CDUD);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
