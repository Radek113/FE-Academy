import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ImageTag } from '../../../api/generated/model';
import { provideTranslocoTesting } from '../../../../testing/transloco-testing';
import { PhotoFilter } from './photo-filter';

describe('PhotoFilter', () => {
  let fixture: ComponentFixture<PhotoFilter>;
  let emitted: (readonly ImageTag[])[];

  const chip = (label: string): HTMLButtonElement | null | undefined =>
    Array.from(fixture.nativeElement.querySelectorAll('mat-chip-option') as NodeListOf<HTMLElement>)
      .find((c: HTMLElement): boolean => c.textContent?.trim() === label)
      ?.querySelector('button');

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PhotoFilter],
      providers: [provideTranslocoTesting()],
    }).compileComponents();
    fixture = TestBed.createComponent(PhotoFilter);
    emitted = [];
    fixture.componentInstance.selectedTagsChange.subscribe((tags: readonly ImageTag[]): void => {
      emitted.push(tags);
    });
    fixture.componentRef.setInput('tags', [ImageTag.nature, ImageTag.city]);
    fixture.detectChanges();
  });

  it('should render a chip per tag', () => {
    expect(fixture.nativeElement.querySelectorAll('mat-chip-option').length).toBe(3);
  });

  it('should emit the tag added to the selection', () => {
    chip('Nature')?.click();
    expect(emitted).toEqual([[ImageTag.nature]]);
  });

  it('should emit the selection without a deselected tag', () => {
    fixture.componentRef.setInput('selectedTags', [ImageTag.nature, ImageTag.city]);
    fixture.detectChanges();
    chip('Nature')?.click();
    expect(emitted).toEqual([[ImageTag.city]]);
  });

  it('should show All as selected when nothing is selected and keep it selected on click', () => {
    expect(chip('All')?.closest('mat-chip-option')?.classList).toContain(
      'mdc-evolution-chip--selected',
    );
    chip('All')?.click();
    fixture.detectChanges();
    expect(emitted).toEqual([]);
    expect(chip('All')?.closest('mat-chip-option')?.classList).toContain(
      'mdc-evolution-chip--selected',
    );
  });

  it('should deselect All when a tag is selected and emit an empty list when All is clicked', () => {
    fixture.componentRef.setInput('selectedTags', [ImageTag.city]);
    fixture.detectChanges();
    expect(chip('All')?.closest('mat-chip-option')?.classList).not.toContain(
      'mdc-evolution-chip--selected',
    );
    chip('All')?.click();
    expect(emitted).toEqual([[]]);
  });
});
