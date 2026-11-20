import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ImageTag } from '../../../api/generated/model';
import { provideTranslocoTesting } from '../../../../testing/transloco-testing';
import { getTst, queryTst } from '../../../../testing/tst';
import { PHOTOS_SCOPE_PROVIDER } from '../photos-scope.transloco';
import { PhotoFilter } from './photo-filter';

describe('PhotoFilter', () => {
  let fixture: ComponentFixture<PhotoFilter>;
  let el: HTMLElement;
  let emitted: (readonly ImageTag[])[];

  const clickChip = (id: string): void => {
    getTst<HTMLButtonElement>(el, id).querySelector('button')?.click();
    fixture.detectChanges();
  };
  const setSelected = (tags: ImageTag[]): void => {
    fixture.componentRef.setInput('selectedTags', tags);
    fixture.detectChanges();
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PhotoFilter],
      providers: [provideTranslocoTesting(), PHOTOS_SCOPE_PROVIDER],
    }).compileComponents();
    fixture = TestBed.createComponent(PhotoFilter);
    el = fixture.nativeElement;
    emitted = [];
    fixture.componentInstance.selectedTagsChange.subscribe((tags: readonly ImageTag[]): void => {
      emitted.push(tags);
    });
    fixture.componentRef.setInput('tags', [ImageTag.nature, ImageTag.city]);
    fixture.detectChanges();
  });

  it('should render an All chip and a chip per tag', () => {
    // when
    // then
    expect(queryTst(el, 'photo-filter-all')).not.toBeNull();
    expect(getTst(el, 'photo-filter-tag-nature').textContent).toContain('Nature');
    expect(queryTst(el, 'photo-filter-tag-city')).not.toBeNull();
  });

  it('should emit the tag added to the selection', () => {
    // when
    clickChip('photo-filter-tag-nature');

    // then
    expect(emitted).toEqual([[ImageTag.nature]]);
  });

  it('should emit the selection without a deselected tag', () => {
    // given
    setSelected([ImageTag.nature, ImageTag.city]);

    // when
    clickChip('photo-filter-tag-nature');

    // then
    expect(emitted).toEqual([[ImageTag.city]]);
  });

  it('should keep All selected when nothing is selected and All is clicked', () => {
    // when
    clickChip('photo-filter-all');

    // then
    expect(emitted).toEqual([]);
  });

  it('should deselect All while tags are selected and clear the selection when it is clicked', () => {
    // given
    setSelected([ImageTag.city]);

    // when
    clickChip('photo-filter-all');

    // then
    expect(emitted).toEqual([[]]);
  });
});
