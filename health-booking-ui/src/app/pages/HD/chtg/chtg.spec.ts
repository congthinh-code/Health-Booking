import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CHTG } from './chtg';

describe('CHTG', () => {
  let component: CHTG;
  let fixture: ComponentFixture<CHTG>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CHTG],
    }).compileComponents();

    fixture = TestBed.createComponent(CHTG);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
