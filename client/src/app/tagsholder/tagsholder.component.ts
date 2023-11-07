import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { MatChipListbox, MatChipsModule } from '@angular/material/chips';
import { Tag } from '../models/tag';
import { CookerService } from '../cooker/cooker.service';

@Component({
  selector: 'app-tagsholder',
  templateUrl: './tagsholder.component.html',
  styleUrls: ['./tagsholder.component.scss'],
  standalone: true,
  imports: [MatChipsModule, CommonModule],
})
export class TagsholderComponent implements AfterViewInit {
  @ViewChild('chipList') chipList?: MatChipListbox;

  @Input() tags: Tag[] = [];
  @Input() type?: string;

  @Output() onTagSelectionChanged = new EventEmitter<Tag>();

  constructor(private cookerService: CookerService) {}

  ngAfterViewInit(): void {
    this.cookerService.tagsSelectedForSearch.forEach((selectedTag) => {
      var chip = this.chipList?._chips.find((c) => c.value == selectedTag.name);
      if (chip) chip.selected = true;
    });
  }

  selectTag(tag: Tag) {
    var chip = this.chipList?._chips.find((c) => c.value == tag.name);
    tag.active = chip?.selected as boolean;

    this.cookerService.selectTag(tag);
    this.onTagSelectionChanged.emit(tag);
  }
}
