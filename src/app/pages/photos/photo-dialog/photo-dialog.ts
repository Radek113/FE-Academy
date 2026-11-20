import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  linkedSignal,
  signal,
  viewChild,
  type ElementRef,
  type Signal,
  type WritableSignal,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslocoDirective } from '@jsverse/transloco';
import type { ImageMetadata } from '../../../api/generated/model';
import { PHOTOS_SCOPE } from '../photos-scope.transloco';
import type { PhotoDialogData } from './models/photo-dialog-data';
import { PhotoInfo } from './photo-info/photo-info';

const SWIPE_THRESHOLD_PX = 50;
const DEFAULT_EXTENSION = 'jpg';
const EXTENSION_BY_MIME_TYPE: Readonly<Record<string, string>> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/avif': 'avif',
};

@Component({
  selector: 'app-photo-dialog',
  imports: [
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    MatProgressSpinnerModule,
    PhotoInfo,
    TranslocoDirective,
  ],
  host: {
    '(window:keydown)': 'onKey($event)',
    '(document:fullscreenchange)': 'onFullscreenChange()',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './photo-dialog.html',
  styleUrl: './photo-dialog.scss',
})
export class PhotoDialog {
  private readonly data: PhotoDialogData = inject<PhotoDialogData>(MAT_DIALOG_DATA);
  private readonly document: Document = inject(DOCUMENT);
  private readonly imageContainer: Signal<ElementRef<HTMLElement> | undefined> =
    viewChild<ElementRef<HTMLElement>>('imageContainer');
  private touchStartX: number | null = null;

  protected readonly prefix: string = PHOTOS_SCOPE;
  protected readonly index: WritableSignal<number> = signal<number>(this.data.index);
  protected readonly image: Signal<ImageMetadata> = computed((): ImageMetadata => {
    const image: ImageMetadata | undefined = this.data.images[this.index()];
    if (!image) {
      throw new Error(`No image at index ${this.index()}`);
    }
    return image;
  });
  protected readonly hasPrev: Signal<boolean> = computed((): boolean => this.index() > 0);
  protected readonly hasNext: Signal<boolean> = computed(
    (): boolean => this.index() < this.data.images.length - 1,
  );
  protected readonly loading: WritableSignal<boolean> = linkedSignal<ImageMetadata, boolean>({
    source: this.image,
    computation: (): boolean => true,
  });
  protected readonly fullscreen: WritableSignal<boolean> = signal<boolean>(false);

  protected onKey(event: KeyboardEvent): void {
    if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) {
      return;
    }
    if (event.key === 'ArrowLeft') {
      this.prev();
    } else if (event.key === 'ArrowRight') {
      this.next();
    }
  }

  protected onFullscreenChange(): void {
    this.fullscreen.set(this.document.fullscreenElement === this.imageContainer()?.nativeElement);
  }

  protected async toggleFullscreen(): Promise<void> {
    try {
      if (this.document.fullscreenElement) {
        await this.document.exitFullscreen();
      } else {
        await this.imageContainer()?.nativeElement.requestFullscreen();
      }
    } catch {
      // Fullscreen unsupported or denied
    }
  }

  protected onTouchStart(event: TouchEvent): void {
    this.touchStartX = event.touches.length === 1 ? (event.touches[0]?.clientX ?? null) : null;
  }

  protected onTouchEnd(event: TouchEvent): void {
    const endX: number | undefined = event.changedTouches[0]?.clientX;
    if (this.touchStartX === null || endX === undefined) {
      return;
    }
    const delta: number = endX - this.touchStartX;
    this.touchStartX = null;
    if (Math.abs(delta) < SWIPE_THRESHOLD_PX) {
      return;
    }
    if (delta > 0) {
      this.prev();
    } else {
      this.next();
    }
  }

  protected onImageSettled(): void {
    this.loading.set(false);
  }

  protected prev(): void {
    if (this.hasPrev()) {
      this.index.update((i: number): number => i - 1);
    }
  }

  protected next(): void {
    if (this.hasNext()) {
      this.index.update((i: number): number => i + 1);
    }
  }

  protected async download(): Promise<void> {
    const { detailedUrl, id } = this.image();
    try {
      const response: Response = await fetch(detailedUrl);
      if (!response.ok) {
        throw new Error(`Download failed with status ${response.status}`);
      }
      const blob: Blob = await response.blob();
      const objectUrl: string = URL.createObjectURL(blob);
      const extension: string = EXTENSION_BY_MIME_TYPE[blob.type] ?? DEFAULT_EXTENSION;
      this.triggerDownload(objectUrl, `${id}.${extension}`);
      // Give the browser time to start the download before releasing the blob.
      setTimeout((): void => URL.revokeObjectURL(objectUrl));
    } catch {
      this.triggerDownload(detailedUrl, `${id}.${DEFAULT_EXTENSION}`);
    }
  }

  private triggerDownload(href: string, filename: string): void {
    const anchor: HTMLAnchorElement = this.document.createElement('a');
    anchor.href = href;
    anchor.download = filename;
    anchor.rel = 'noopener';
    if (!href.startsWith('blob:')) {
      // `download` is ignored for cross-origin URLs, so open them in a new tab instead.
      anchor.target = '_blank';
    }
    anchor.click();
  }
}
