import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbRatingModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-rating',
  standalone: true,
  imports: [CommonModule, NgbRatingModule],
  template: `
    <ngb-rating [rate]="rate" (rateChange)="onRateChange($event)" class="mt-2">
      <ng-template let-fill="fill" let-index="index">
        <i
          class="bi-star{{ fill === 100 ? '-fill' : '' }}"
          [class.filled]="fill === 100"
          [class.low]="index < rate"
        ></i>
      </ng-template>
    </ngb-rating>
    <p style="margin-bottom: 0" class="mat-small">
      rating: <b>{{ rate | number : '1.2-2' }}</b></p>
  `,
  styles: [
    `
      i {
        font-size: 1rem;
        padding-right: 0.1rem;
        color: #b0c4de;
      }

      .filled {
        color: #f75727;
      }

      .low {
        color: #d1aa29;
      }

      .filled.low {
        color: #ffa51e;
      }
    `,
  ],
})
export class RecipeDetailsRatingComponent {
  @Input() rate: number = 0;
  @Output() rateChange: EventEmitter<number> = new EventEmitter<number>();

  onRateChange(event: number) {
    this.rateChange.emit(event);
  }
}
