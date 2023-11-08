import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

@NgModule({
  declarations: [],
  imports: [CommonModule],
})
export class SharedAnimationsModule {
  static openCloseAnimation = trigger('openClose', [
    state('*', style({ opacity: 0 })),
    state('open', style({ opacity: 1 })),
    transition('* => open', [animate('.25s ease-in')]),
  ]);

  static elementAddedAnimation = trigger('add', [
    state('*', style({ opacity: 0, transform: 'translateY(100%)' })),
    state('added', style({ opacity: 1, transform: 'translateY(0%)' })),
    transition('* => added', [animate('.15s ease-in')]),
  ]);
}
