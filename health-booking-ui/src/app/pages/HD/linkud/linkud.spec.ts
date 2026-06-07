import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Linkud } from './linkud';

describe('Linkud', () => {
  let component: Linkud;
  let fixture: ComponentFixture<Linkud>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Linkud],
    }).compileComponents();

    fixture = TestBed.createComponent(Linkud);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
