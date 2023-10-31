import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipeAddIngredientsComponent } from './recipe-add-ingredients.component';

describe('RecipeAddIngredientsComponent', () => {
  let component: RecipeAddIngredientsComponent;
  let fixture: ComponentFixture<RecipeAddIngredientsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RecipeAddIngredientsComponent]
    });
    fixture = TestBed.createComponent(RecipeAddIngredientsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
