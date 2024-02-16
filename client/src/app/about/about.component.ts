import { Component } from '@angular/core';
import { SharedAnimationsModule } from '../common/animations/shared-animations.module';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  standalone: true,
  imports: [SharedAnimationsModule],
  animations: [SharedAnimationsModule.openCloseAnimation],
})
export class AboutComponent {}
