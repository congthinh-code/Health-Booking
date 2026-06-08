import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Ttvp } from './ttvp';

describe('Ttvp', () => {
  let component: Ttvp;
  let fixture: ComponentFixture<Ttvp>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Ttvp],
    }).compileComponents();

    fixture = TestBed.createComponent(Ttvp);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
