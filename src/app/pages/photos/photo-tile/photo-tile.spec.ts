import { ComponentFixture, TestBed } from '@angular/core/testing';
import { makeImage } from '../../../../testing/image-factory';
import { getTst, queryTst } from '../../../../testing/tst';
import { PhotoTile } from './photo-tile';

describe('PhotoTile', () => {
  const image = makeImage({ title: 'Sunrise', thumbhash: 'nwgeDQJ6eI+Hd3Z4h4eIiHlflPh2' });
  let fixture: ComponentFixture<PhotoTile>;
  let el: HTMLElement;

  const setup = (thumbhash: string | undefined = image.thumbhash): void => {
    fixture = TestBed.createComponent(PhotoTile);
    fixture.componentRef.setInput('image', { ...image, thumbhash });
    fixture.detectChanges();
    el = fixture.nativeElement;
  };

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [PhotoTile] });
  });

  it('should render the preview image with alt text', () => {
    // when
    setup();

    // then
    const img = getTst<HTMLImageElement>(el, 'photo-tile-image');
    expect(img.getAttribute('src')).toBe(image.previewUrl);
    expect(img.alt).toBe('Sunrise');
  });

  it('should show the thumbhash placeholder as background', () => {
    // when
    setup();

    // then
    expect(getTst(el, 'photo-tile-button').style.backgroundImage).toContain(
      'data:image/png;base64',
    );
  });

  it('should not set a placeholder for an undecodable thumbhash', () => {
    // when
    setup('%%% not base64 %%%');

    // then
    expect(getTst(el, 'photo-tile-button').style.backgroundImage).toBe('');
  });

  it('should fade the image in once loaded', () => {
    // given
    setup();
    const img = getTst(el, 'photo-tile-image');

    // when
    img.dispatchEvent(new Event('load'));
    fixture.detectChanges();

    // then
    expect(img.classList).not.toContain('loading');
  });

  it('should show a fallback when the image fails to load', () => {
    // given
    setup();

    // when
    getTst(el, 'photo-tile-image').dispatchEvent(new Event('error'));
    fixture.detectChanges();

    // then
    expect(queryTst(el, 'photo-tile-image')).toBeNull();
    expect(queryTst(el, 'photo-tile-fallback')).not.toBeNull();
  });

  it('should emit opened on click', () => {
    // given
    setup();
    const opened = vi.fn();
    fixture.componentInstance.opened.subscribe(opened);

    // when
    getTst(el, 'photo-tile-button').click();

    // then
    expect(opened).toHaveBeenCalledOnce();
  });
});
