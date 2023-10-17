import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatChipListboxChange, MatChipsModule } from '@angular/material/chips';
import { Tag } from '../models/tag';

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

  @Output() updatedTag = new EventEmitter<Tag>();

  onChange(event : MatChipListboxChange) {
    const selectedTag : Tag = { name: event.value, category: this.type as string};
    this.updatedTag.emit(selectedTag);
  }
}
