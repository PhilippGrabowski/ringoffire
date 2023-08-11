import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DrinkChallengeComponent } from './drink-challenge.component';

describe('DrinkChallengeComponent', () => {
  let component: DrinkChallengeComponent;
  let fixture: ComponentFixture<DrinkChallengeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DrinkChallengeComponent]
    });
    fixture = TestBed.createComponent(DrinkChallengeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
