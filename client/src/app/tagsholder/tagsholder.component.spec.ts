import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TagsholderComponent } from './tagsholder.component';

describe('TagsholderComponent', () => {
  let component: TagsholderComponent;
  let fixture: ComponentFixture<TagsholderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TagsholderComponent]
    });
    fixture = TestBed.createComponent(TagsholderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
