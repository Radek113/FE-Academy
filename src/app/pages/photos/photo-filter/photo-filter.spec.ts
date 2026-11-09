import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ImageTag } from '../../../api/generated/model';
import { PhotoFilter } from './photo-filter';

describe('PhotoFilter', () => {
  let fixture: ComponentFixture<PhotoFilter>;
  let emitted: (readonly ImageTag[])[];

  const chip = (label: string): HTMLButtonElement | null | undefined =>
    Array.from(fixture.nativeElement.querySelectorAll('mat-chip-option') as NodeListOf<HTMLElement>)
      .find((c: HTMLElement): boolean => c.textContent?.trim() === label)
      ?.querySelector('button');

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [PhotoFilter] }).compileComponents();
    fixture = TestBed.createComponent(PhotoFilter);
    emitted = [];
    fixture.componentInstance.selectedTagsChange.subscribe((tags: readonly ImageTag[]): void => {
      emitted.push(tags);
    });
    fixture.componentRef.setInput('tags', [ImageTag.nature, ImageTag.city]);
    fixture.detectChanges();
  });

  it('should render a chip per tag', () => {
    expect(fixture.nativeElement.querySelectorAll('mat-chip-option').length).toBe(2);
  });

  it('should emit the tag added to the selection', () => {
    chip('nature')?.click();
    expect(emitted).toEqual([[ImageTag.nature]]);
  });

  it('should emit the selection without a deselected tag', () => {
    fixture.componentRef.setInput('selectedTags', [ImageTag.nature, ImageTag.city]);
    fixture.detectChanges();
    chip('nature')?.click();
    expect(emitted).toEqual([[ImageTag.city]]);
  });

  it('should disable All when nothing is selected and emit an empty list when clicked', () => {
    const all: HTMLButtonElement = fixture.nativeElement.querySelector('button[matButton]');
    expect(all.disabled).toBe(true);

    fixture.componentRef.setInput('selectedTags', [ImageTag.city]);
    fixture.detectChanges();
    expect(all.disabled).toBe(false);
    all.click();
    expect(emitted).toEqual([[]]);
  });
});
