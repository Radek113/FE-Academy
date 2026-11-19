import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ImageTag, type ImageMetadata } from '../../../api/generated/model';
import { provideTranslocoTesting } from '../../../../testing/transloco-testing';
import { PhotoDialog, type PhotoDialogData } from './photo-dialog';

const make = (id: string): ImageMetadata => ({
  id,
  title: `Title ${id}`,
  location: 'Warsaw',
  date: '2024-03-05T10:00:00Z',
  takenWith: 'Sony A7 III',
  width: 100,
  height: 100,
  previewUrl: `http://x/${id}`,
  detailedUrl: `http://x/${id}/full`,
  tags: [ImageTag.city, ImageTag.night],
});

describe('PhotoDialog', () => {
  let fixture: ComponentFixture<PhotoDialog>;
  let el: HTMLElement;

  const create = async (index: number): Promise<void> => {
    const data: PhotoDialogData = { images: [make('a'), make('b'), make('c')], index };
    await TestBed.configureTestingModule({
      imports: [PhotoDialog],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: data },
        { provide: MatDialogRef, useValue: { close: (): void => undefined } },
        provideTranslocoTesting(),
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(PhotoDialog);
    fixture.detectChanges();
    el = fixture.nativeElement;
  };

  const button = (label: string): HTMLButtonElement =>
    Array.from(el.querySelectorAll('button')).find((b: HTMLButtonElement): boolean =>
      (b.textContent ?? '').includes(label),
    ) as HTMLButtonElement;

  it('should show details of the selected image', async () => {
    await create(0);
    const text: string = el.textContent ?? '';
    expect(text).toContain('Title a');
    expect(text).toContain('Warsaw');
    expect(text).toContain('Sony A7 III');
    expect(text).toContain('March 5, 2024');
    expect(text).toContain('Night');
  });

  it('should navigate with the next and previous buttons', async () => {
    await create(0);
    expect(button('Previous').disabled).toBe(true);

    button('Next').click();
    fixture.detectChanges();
    expect(el.textContent).toContain('Title b');

    button('Previous').click();
    fixture.detectChanges();
    expect(el.textContent).toContain('Title a');
  });

  it('should disable Next on the last image', async () => {
    await create(2);
    expect(button('Next').disabled).toBe(true);
  });

  it('should navigate with arrow keys', async () => {
    await create(1);
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
    fixture.detectChanges();
    expect(el.textContent).toContain('Title c');
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));
    fixture.detectChanges();
    expect(el.textContent).toContain('Title b');
  });

  it('should request fullscreen when the image is clicked', async () => {
    await create(0);
    const container: HTMLElement = el.querySelector('img')!.parentElement as HTMLElement;
    const spy = vi.fn().mockResolvedValue(undefined);
    container.requestFullscreen = spy;
    el.querySelector('img')!.click();
    expect(spy).toHaveBeenCalled();
  });

  it('should hide the image and show a spinner until it loads', async () => {
    await create(0);
    const img: HTMLImageElement = el.querySelector('img') as HTMLImageElement;
    expect(el.querySelector('mat-spinner')).not.toBeNull();
    expect(img.classList).toContain('loading');

    img.dispatchEvent(new Event('load'));
    fixture.detectChanges();
    expect(el.querySelector('mat-spinner')).toBeNull();
    expect(img.classList).not.toContain('loading');
  });
});
