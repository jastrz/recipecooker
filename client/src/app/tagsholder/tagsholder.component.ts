import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-tagsholder',
  templateUrl: './tagsholder.component.html',
  styleUrls: ['./tagsholder.component.scss'],
  standalone: true,
  imports: [MatChipsModule, CommonModule]
})
export class TagsholderComponent {
  @Input() type?: string;
  @Input() tags?: string[];
}
