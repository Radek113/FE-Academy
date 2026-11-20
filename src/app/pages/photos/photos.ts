import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  Injector,
  type ResourceRef,
  signal,
  type Signal,
  type WritableSignal,
} from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslocoDirective } from '@jsverse/transloco';
import { type ImageMetadata, ImageTag } from '../../api/generated/model';
import { ImageMetadataService } from '../../core/services/image-metadata/image-metadata.service';
import type { PhotoDialogData } from './photo-dialog/models/photo-dialog-data';
import { PhotoDialog } from './photo-dialog/photo-dialog';
import { PhotoFilter } from './photo-filter/photo-filter';
import { PhotoTile } from './photo-tile/photo-tile';
import { PhotosEmpty } from './photos-empty/photos-empty';
import { PHOTOS_SCOPE } from './photos-scope.transloco';

const DIALOG_WIDTH = '1100px';
const DIALOG_MAX_WIDTH = '95vw';

@Component({
  selector: 'app-photos',
  imports: [
    MatButtonModule,
    MatProgressSpinnerModule,
    PhotoFilter,
    PhotosEmpty,
    PhotoTile,
    TranslocoDirective,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './photos.html',
  styleUrl: './photos.scss',
})
export class Photos {
  private readonly imageMetadataService: ImageMetadataService = inject(ImageMetadataService);
  private readonly dialog: MatDialog = inject(MatDialog);
  private readonly injector: Injector = inject(Injector);

  protected readonly prefix: string = PHOTOS_SCOPE;
  protected readonly allTags: readonly ImageTag[] = Object.values(ImageTag);
  protected readonly images: ResourceRef<ImageMetadata[] | undefined> = rxResource({
    stream: () => this.imageMetadataService.getImages(),
  });
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
      injector: this.injector,
      maxWidth: DIALOG_MAX_WIDTH,
      width: DIALOG_WIDTH,
      autoFocus: false,
    });
  }
}
