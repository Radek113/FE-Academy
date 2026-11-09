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
import { ImagesService } from '../../api/generated/endpoints';
import { type ImageMetadata, ImageTag } from '../../api/generated/model';
import { PhotoDialog, type PhotoDialogData } from './photo-dialog/photo-dialog';
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
  styleUrl: './photos.css',
})
export class Photos {
  protected readonly prefix: string = 'photos';
  private readonly imagesService: ImagesService = inject(ImagesService);
  private readonly dialog: MatDialog = inject(MatDialog);

  protected readonly images: ResourceRef<ImageMetadata[] | undefined> = rxResource({
    stream: () => this.imagesService.getImagesMetadata(),
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
