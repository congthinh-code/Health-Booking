import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Bvtu } from './bvtu';

describe('Bvtu', () => {
  let component: Bvtu;
  let fixture: ComponentFixture<Bvtu>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Bvtu],
    }).compileComponents();

    fixture = TestBed.createComponent(Bvtu);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
