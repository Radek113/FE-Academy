import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { NEVER, of, throwError, type Observable } from 'rxjs';
import { ImageTag, type ImageMetadata } from '../../api/generated/model';
import { ImageMetadataService } from '../../core/services/image-metadata/image-metadata.service';
import { makeImage } from '../../../testing/image-factory';
import { provideTranslocoTesting } from '../../../testing/transloco-testing';
import { getTst, queryAllTst, queryTst } from '../../../testing/tst';
import { PhotoDialog } from './photo-dialog/photo-dialog';
import { Photos } from './photos';
import { PHOTOS_SCOPE_PROVIDER } from './photos-scope.transloco';

describe('Photos', () => {
  const nature = makeImage({ id: 'a', tags: [ImageTag.nature] });
  const city = makeImage({ id: 'b', tags: [ImageTag.city] });
  const sea = makeImage({ id: 'c', tags: [ImageTag.sea] });
  const dialogOpen = vi.fn();

  const setup = async (getImages: () => Observable<ImageMetadata[]>, settle = true) => {
    TestBed.configureTestingModule({
      imports: [Photos],
      providers: [
        { provide: ImageMetadataService, useValue: { getImages } },
        { provide: MatDialog, useValue: { open: dialogOpen } },
        provideTranslocoTesting(),
        PHOTOS_SCOPE_PROVIDER,
      ],
    });
    const fixture = TestBed.createComponent(Photos);
    const el: HTMLElement = fixture.nativeElement;
    fixture.detectChanges();
    if (settle) {
      await fixture.whenStable();
      fixture.detectChanges();
    }

    const clickTag = (tag: ImageTag): void => {
      getTst(el, `photo-filter-tag-${tag}`).querySelector('button')?.click();
      fixture.detectChanges();
    };
    const tileIds = (): string[] =>
      queryAllTst<HTMLImageElement>(el, 'photo-tile-image').map((img) => img.alt);

    return { fixture, el, clickTag, tileIds };
  };

  beforeEach(() => {
    dialogOpen.mockReset();
  });

  it('should render a tile per photo', async () => {
    // when
    const { el } = await setup(() => of([nature, city, sea]));

    // then
    expect(queryAllTst(el, 'photo-tile')).toHaveLength(3);
  });

  it('should show a spinner while loading', async () => {
    // when
    const { el } = await setup(() => NEVER, false);

    // then
    expect(queryTst(el, 'photos-loading')).not.toBeNull();
    expect(queryTst(el, 'photos-gallery')).toBeNull();
  });

  it('should show matching photos for multiple selected tags', async () => {
    // given
    const { clickTag, tileIds } = await setup(() => of([nature, city, sea]));

    // when
    clickTag(ImageTag.nature);
    clickTag(ImageTag.city);

    // then
    expect(tileIds()).toEqual([nature.title, city.title]);
  });

  it('should show an empty message when no photo matches', async () => {
    // given
    const { el, clickTag } = await setup(() => of([nature]));

    // when
    clickTag(ImageTag.wildlife);

    // then
    expect(queryTst(el, 'photos-empty')).not.toBeNull();
  });

  it('should show an error and reload on retry', async () => {
    // given
    const getImages = vi
      .fn<() => Observable<ImageMetadata[]>>()
      .mockReturnValueOnce(throwError(() => new Error('boom')))
      .mockReturnValue(of([nature]));
    const { fixture, el } = await setup(getImages);

    // when
    getTst(el, 'photos-retry').click();
    await fixture.whenStable();
    fixture.detectChanges();

    // then
    expect(queryTst(el, 'photos-error')).toBeNull();
    expect(getImages).toHaveBeenCalledTimes(2);
    expect(queryAllTst(el, 'photo-tile')).toHaveLength(1);
  });

  it('should open the dialog on the clicked photo within the filtered list', async () => {
    // given
    const { el, clickTag } = await setup(() => of([nature, city, sea]));
    clickTag(ImageTag.city);
    clickTag(ImageTag.sea);

    // when
    getTst(queryAllTst(el, 'photo-tile')[1] as HTMLElement, 'photo-tile-button').click();

    // then
    expect(dialogOpen).toHaveBeenCalledWith(
      PhotoDialog,
      expect.objectContaining({ data: { images: [city, sea], index: 1 } }),
    );
  });
});
