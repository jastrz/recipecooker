import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipeAddStepsComponent } from './recipe-add-steps.component';

describe('RecipeAddStepsComponent', () => {
  let component: RecipeAddStepsComponent;
  let fixture: ComponentFixture<RecipeAddStepsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RecipeAddStepsComponent]
    });
    fixture = TestBed.createComponent(RecipeAddStepsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
