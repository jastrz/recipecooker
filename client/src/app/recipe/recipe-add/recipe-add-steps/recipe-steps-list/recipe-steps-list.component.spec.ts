import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipeStepsListComponent } from './recipe-steps-list.component';

describe('RecipeStepsListComponent', () => {
  let component: RecipeStepsListComponent;
  let fixture: ComponentFixture<RecipeStepsListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RecipeStepsListComponent]
    });
    fixture = TestBed.createComponent(RecipeStepsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
