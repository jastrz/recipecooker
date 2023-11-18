import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipeVerificationComponent } from './recipe-verification.component';

describe('RecipeVerificationComponent', () => {
  let component: RecipeVerificationComponent;
  let fixture: ComponentFixture<RecipeVerificationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RecipeVerificationComponent]
    });
    fixture = TestBed.createComponent(RecipeVerificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
