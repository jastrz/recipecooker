import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { Router } from '@angular/router';
import { RecipesService } from 'src/app/recipe/recipes.service';

@Component({
  selector: 'app-generator-view',
  templateUrl: './generator-view.component.html',
  standalone: true,
  imports: [
    MatSlideToggleModule,
    MatFormFieldModule,
    MatInputModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class GeneratorViewComponent {
  @Output() generateRequest = new EventEmitter<string>();

  generatorForm = this.fb.group({
    description: [''],
  });

  constructor(
    private fb: FormBuilder,
    private recipeService: RecipesService,
    private router: Router
  ) {}

  onGenerateRecipeClicked() {
    const description = this.generatorForm.get('description')?.value ?? '';
    this.generateRequest.emit(description);

    const request = { description };
    this.recipeService.getAIGeneratedRecipe(request).subscribe({
      next: (response) => {
        this.router.navigateByUrl(`cook/recipe/${response.id}`);
      },
      error: (error) => console.log(error),
    });
  }
}
