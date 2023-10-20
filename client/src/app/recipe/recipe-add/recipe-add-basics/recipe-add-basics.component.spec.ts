import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipeAddBasicsComponent } from './recipe-add-basics.component';

describe('RecipeAddBasicsComponent', () => {
  let component: RecipeAddBasicsComponent;
  let fixture: ComponentFixture<RecipeAddBasicsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RecipeAddBasicsComponent]
    });
    fixture = TestBed.createComponent(RecipeAddBasicsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
