import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatChipListbox, MatChipsModule } from '@angular/material/chips';
import { Tag } from '../models/tag';

@Component({
  selector: 'app-tagsholder',
  templateUrl: './tagsholder.component.html',
  styleUrls: ['./tagsholder.component.scss'],
  standalone: true,
  imports: [MatChipsModule, CommonModule]
})
export class TagsholderComponent {
  @ViewChild('chipList') chipList?: MatChipListbox;

  @Input() tags: Tag[] = [];
  @Input() type?: string;

  @Output() onTagSelectionChanged = new EventEmitter<Tag>();

  selectTag(tag: Tag) {
    var chip = this.chipList?._chips.find(c => c.value == tag.name);
    tag.active = chip?.selected as boolean;
    this.onTagSelectionChanged.emit(tag);
  }
}
