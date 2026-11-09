import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  HostListener,
  inject,
  signal,
  type Signal,
  type WritableSignal,
} from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { provideTranslocoScope, TranslocoDirective } from '@jsverse/transloco';
import type { ImageMetadata } from '../../../api/generated/model';

export interface PhotoDialogData {
  images: ImageMetadata[];
  index: number;
}

@Component({
  selector: 'app-photo-dialog',
  imports: [
    DatePipe,
    MatButtonModule,
    MatChipsModule,
    MatDialogModule,
    MatIconModule,
    MatProgressSpinnerModule,
    TranslocoDirective,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideTranslocoScope({ scope: 'photos' })],
  templateUrl: './photo-dialog.html',
  styleUrl: './photo-dialog.css',
})
export class PhotoDialog {
  protected readonly prefix: string = 'photos';
  private readonly data: PhotoDialogData = inject<PhotoDialogData>(MAT_DIALOG_DATA);

  protected readonly index: WritableSignal<number> = signal<number>(this.data.index);
  protected readonly image: Signal<ImageMetadata> = computed(
    (): ImageMetadata => this.data.images[this.index()],
  );
  protected readonly hasPrev: Signal<boolean> = computed((): boolean => this.index() > 0);
  protected readonly hasNext: Signal<boolean> = computed(
    (): boolean => this.index() < this.data.images.length - 1,
  );
  protected readonly loading: WritableSignal<boolean> = signal<boolean>(true);

  constructor() {
    effect(() => {
      this.image();
      this.loading.set(true);
    });
  }

  @HostListener('window:keydown', ['$event'])
  protected onKey(event: KeyboardEvent): void {
    if (event.key === 'ArrowLeft') this.prev();
    else if (event.key === 'ArrowRight') this.next();
  }

  protected onImageSettled(): void {
    this.loading.set(false);
  }

  protected prev(): void {
    if (this.hasPrev()) this.index.update((i) => i - 1);
  }

  protected next(): void {
    if (this.hasNext()) this.index.update((i) => i + 1);
  }

  // TODO: improve/verify
  protected async download(): Promise<void> {
    const { detailedUrl, id } = this.image();
    try {
      const blob = await (await fetch(detailedUrl)).blob();
      const url = URL.createObjectURL(blob);
      this.triggerDownload(url, `${id}.jpg`);
      URL.revokeObjectURL(url);
    } catch {
      this.triggerDownload(detailedUrl, `${id}.jpg`);
    }
  }

  private triggerDownload(href: string, filename: string): void {
    const a = document.createElement('a');
    a.href = href;
    a.download = filename;
    a.target = '_blank';
    a.rel = 'noopener';
    a.click();
  }
}
