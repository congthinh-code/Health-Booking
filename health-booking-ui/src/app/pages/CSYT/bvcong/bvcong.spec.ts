import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Bvcong } from './bvcong';

describe('Bvcong', () => {
  let component: Bvcong;
  let fixture: ComponentFixture<Bvcong>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Bvcong],
    }).compileComponents();

    fixture = TestBed.createComponent(Bvcong);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
