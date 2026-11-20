import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { makeImage } from '../../../../testing/image-factory';
import { provideTranslocoTesting } from '../../../../testing/transloco-testing';
import { getTst, queryTst } from '../../../../testing/tst';
import { PHOTOS_SCOPE_PROVIDER } from '../photos-scope.transloco';
import type { PhotoDialogData } from './models/photo-dialog-data';
import { PhotoDialog } from './photo-dialog';

describe('PhotoDialog', () => {
  const images = ['a', 'b', 'c'].map((id: string) => makeImage({ id, title: `Title ${id}` }));
  let fixture: ComponentFixture<PhotoDialog>;
  let el: HTMLElement;

  const create = async (index: number): Promise<void> => {
    const data: PhotoDialogData = { images, index };
    await TestBed.configureTestingModule({
      imports: [PhotoDialog],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: data },
        { provide: MatDialogRef, useValue: { close: vi.fn() } },
        provideTranslocoTesting(),
        PHOTOS_SCOPE_PROVIDER,
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(PhotoDialog);
    fixture.detectChanges();
    el = fixture.nativeElement;
  };

  const click = (id: string): void => {
    getTst(el, id).click();
    fixture.detectChanges();
  };
  const title = (): string | null | undefined => getTst(el, 'photo-dialog-title').textContent;
  const pressKey = (init: KeyboardEventInit): void => {
    window.dispatchEvent(new KeyboardEvent('keydown', init));
    fixture.detectChanges();
  };
  const swipe = (fromX: number, toX: number): void => {
    const viewer = getTst(el, 'photo-dialog-viewer');
    const fire = (type: string, key: 'touches' | 'changedTouches', x: number): void => {
      const event = new Event(type, { bubbles: true });
      Object.defineProperty(event, key, { value: [{ clientX: x }] });
      viewer.dispatchEvent(event);
    };
    fire('touchstart', 'touches', fromX);
    fire('touchend', 'changedTouches', toX);
    fixture.detectChanges();
  };

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('should show the selected image', async () => {
    // when
    await create(0);

    // then
    expect(title()).toBe('Title a');
    expect(getTst<HTMLImageElement>(el, 'photo-dialog-image').getAttribute('src')).toBe(
      images[0]?.detailedUrl,
    );
  });

  describe('navigation', () => {
    it('should move with the previous and next buttons', async () => {
      // given
      await create(0);
      const prevDisabledAtStart = getTst<HTMLButtonElement>(el, 'photo-dialog-prev').disabled;

      // when
      click('photo-dialog-next');
      const afterNext = title();
      click('photo-dialog-prev');

      // then
      expect(prevDisabledAtStart).toBe(true);
      expect(afterNext).toBe('Title b');
      expect(title()).toBe('Title a');
    });

    it('should disable next on the last image', async () => {
      // when
      await create(2);

      // then
      expect(getTst<HTMLButtonElement>(el, 'photo-dialog-next').disabled).toBe(true);
      expect(queryTst(el, 'photo-dialog-nav-next')).toBeNull();
    });

    it('should move with the arrow keys', async () => {
      // given
      await create(1);

      // when
      pressKey({ key: 'ArrowRight' });
      const afterRight = title();
      pressKey({ key: 'ArrowLeft' });

      // then
      expect(afterRight).toBe('Title c');
      expect(title()).toBe('Title b');
    });

    it('should ignore arrow keys pressed with a modifier', async () => {
      // given
      await create(1);

      // when
      pressKey({ key: 'ArrowLeft', altKey: true });

      // then
      expect(title()).toBe('Title b');
    });

    it('should move on a horizontal swipe', async () => {
      // given
      await create(1);

      // when
      swipe(200, 100);
      const afterSwipeLeft = title();
      swipe(100, 200);

      // then
      expect(afterSwipeLeft).toBe('Title c');
      expect(title()).toBe('Title b');
    });

    it('should ignore a short swipe', async () => {
      // given
      await create(1);

      // when
      swipe(100, 130);

      // then
      expect(title()).toBe('Title b');
    });
  });

  describe('image loading', () => {
    it('should show a spinner until the image loads', async () => {
      // given
      await create(0);
      const img = getTst(el, 'photo-dialog-image');
      const spinnerBeforeLoad = queryTst(el, 'photo-dialog-spinner');

      // when
      img.dispatchEvent(new Event('load'));
      fixture.detectChanges();

      // then
      expect(spinnerBeforeLoad).not.toBeNull();
      expect(queryTst(el, 'photo-dialog-spinner')).toBeNull();
      expect(img.classList).not.toContain('loading');
    });

    it('should stop the spinner when the image fails to load', async () => {
      // given
      await create(0);

      // when
      getTst(el, 'photo-dialog-image').dispatchEvent(new Event('error'));
      fixture.detectChanges();

      // then
      expect(queryTst(el, 'photo-dialog-spinner')).toBeNull();
    });

    it('should show the spinner again when another image is shown', async () => {
      // given
      await create(0);
      getTst(el, 'photo-dialog-image').dispatchEvent(new Event('load'));
      fixture.detectChanges();

      // when
      click('photo-dialog-next');

      // then
      expect(queryTst(el, 'photo-dialog-spinner')).not.toBeNull();
    });
  });

  describe('fullscreen', () => {
    it('should request fullscreen when the image is clicked', async () => {
      // given
      await create(0);
      const requestFullscreen = vi.fn().mockResolvedValue(undefined);
      getTst(el, 'photo-dialog-viewer').requestFullscreen = requestFullscreen;

      // when
      click('photo-dialog-image');

      // then
      expect(requestFullscreen).toHaveBeenCalledOnce();
    });

    it('should not throw when fullscreen is denied', async () => {
      // given
      await create(0);
      getTst(el, 'photo-dialog-viewer').requestFullscreen = vi
        .fn()
        .mockRejectedValue(new Error('denied'));

      // when
      // then
      expect(() => click('photo-dialog-fullscreen')).not.toThrow();
    });
  });

  describe('download', () => {
    let clickedAnchors: HTMLAnchorElement[];

    beforeEach(() => {
      clickedAnchors = [];
      vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(function (
        this: HTMLAnchorElement,
      ): void {
        clickedAnchors.push(this);
      });
      Object.assign(URL, {
        createObjectURL: vi.fn().mockReturnValue('blob:photo'),
        revokeObjectURL: vi.fn(),
      });
    });

    it('should download the image as a blob and release it afterwards', async () => {
      // given
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue(new Response('x', { headers: { 'Content-Type': 'image/png' } })),
      );
      await create(0);

      // when
      click('photo-dialog-download');
      await vi.waitFor(() => expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:photo'));

      // then
      expect(clickedAnchors).toHaveLength(1);
      expect(clickedAnchors[0]?.download).toBe('a.png');
      expect(clickedAnchors[0]?.getAttribute('href')).toBe('blob:photo');
    });

    it.each([
      ['the request fails', () => vi.fn().mockRejectedValue(new Error('offline'))],
      [
        'the response is not ok',
        () => vi.fn().mockResolvedValue(new Response('', { status: 404 })),
      ],
    ])('should fall back to the direct url when %s', async (_case, makeFetch) => {
      // given
      vi.stubGlobal('fetch', makeFetch());
      await create(0);

      // when
      click('photo-dialog-download');
      await vi.waitFor(() => expect(clickedAnchors).toHaveLength(1));

      // then
      expect(clickedAnchors[0]?.getAttribute('href')).toBe(images[0]?.detailedUrl);
      expect(clickedAnchors[0]?.target).toBe('_blank');
      expect(URL.createObjectURL).not.toHaveBeenCalled();
    });
  });
});
