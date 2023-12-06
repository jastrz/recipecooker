import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { RecipesService } from 'src/app/recipe/recipes.service';
import {
  Observable,
  OperatorFunction,
  debounceTime,
  distinctUntilChanged,
  map,
} from 'rxjs';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [NgbTypeaheadModule, FormsModule, CommonModule],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {
  @Output() onClickSearchEvent = new EventEmitter<string>();
  names: string[] = [];
  searchTerm: string = '';

  constructor(private recipeService: RecipesService) {}

  ngOnInit(): void {
    this.recipeService.getRecipesForOverview().subscribe({
      next: (result) => {
        this.names = result.map((r) => r.name);
        console.log(this.names);
      },
      error: (error) => console.log(error),
    });
  }

  search: OperatorFunction<string, readonly string[]> = (
    text$: Observable<string>
  ) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map((term) =>
        term.length < 2
          ? []
          : this.names
              .filter((n) => n.toLowerCase().indexOf(term.toLowerCase()) > -1)
              .slice(0, 10)
      )
    );

  onClickSearch() {
    if (this.searchTerm.length > 0)
      this.onClickSearchEvent.emit(this.searchTerm);
  }
}
