import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  type ResourceRef,
  signal,
  type Signal,
  type WritableSignal,
} from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ImageMetadataService } from '../../core/services/image-metadata/image-metadata.service';
import { type ImageMetadata, ImageTag } from '../../api/generated/model';
import { PhotoDialog } from './photo-dialog/photo-dialog';
import type { PhotoDialogData } from './photo-dialog/models/photo-dialog-data';
import { PhotoFilter } from './photo-filter/photo-filter';
import { PhotoTile } from './photo-tile/photo-tile';
import { provideTranslocoScope, TranslocoDirective } from '@jsverse/transloco';

@Component({
  selector: 'app-photos',
  imports: [MatButtonModule, MatProgressSpinnerModule, PhotoFilter, PhotoTile, TranslocoDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    provideTranslocoScope({
      scope: 'photos',
    }),
  ],
  templateUrl: './photos.html',
  styleUrl: './photos.scss',
})
export class Photos {
  protected readonly prefix: string = 'photos';
  private readonly imageMetadataService: ImageMetadataService = inject(ImageMetadataService);
  private readonly dialog: MatDialog = inject(MatDialog);

  protected readonly images: ResourceRef<ImageMetadata[] | undefined> = rxResource({
    stream: () => this.imageMetadataService.getImages(),
  });
  protected readonly allTags: readonly ImageTag[] = Object.values(ImageTag);
  protected readonly selectedTags: WritableSignal<readonly ImageTag[]> = signal<
    readonly ImageTag[]
  >([]);

  protected readonly filteredImages: Signal<ImageMetadata[]> = computed((): ImageMetadata[] => {
    const selected: readonly ImageTag[] = this.selectedTags();
    const all: ImageMetadata[] = this.images.value() ?? [];
    return selected.length
      ? all.filter((image: ImageMetadata): boolean =>
          image.tags.some((tag: ImageTag): boolean => selected.includes(tag)),
        )
      : all;
  });

  protected onSelectedTagsChange(tags: readonly ImageTag[]): void {
    this.selectedTags.set(tags);
  }

  protected open(index: number): void {
    const data: PhotoDialogData = { images: this.filteredImages(), index };
    this.dialog.open<PhotoDialog, PhotoDialogData>(PhotoDialog, {
      data,
      maxWidth: '95vw',
      width: '1100px',
      autoFocus: false,
    });
  }
}
