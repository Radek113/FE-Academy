import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  output,
  signal,
  type InputSignal,
  type OutputEmitterRef,
  type Signal,
  type WritableSignal,
} from '@angular/core';
import type { ImageMetadata } from '../../../api/generated/model';
import { ThumbhashService } from '../../../core/services/thumbhash/thumbhash.service';

@Component({
  selector: 'app-photo-tile',
  host: { class: 'mb-4 block break-inside-avoid' },
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './photo-tile.html',
  styleUrl: './photo-tile.scss',
})
export class PhotoTile {
  private readonly thumbhashService: ThumbhashService = inject(ThumbhashService);

  readonly image: InputSignal<ImageMetadata> = input.required<ImageMetadata>();
  readonly opened: OutputEmitterRef<void> = output<void>();

  protected readonly loaded: WritableSignal<boolean> = signal<boolean>(false);

  protected readonly aspectRatio: Signal<string> = computed(
    (): string => `${this.image().width} / ${this.image().height}`,
  );

  protected readonly placeholder: Signal<string | null> = computed((): string | null => {
    const hash: string | undefined = this.image().thumbhash;
    return hash ? `url(${this.thumbhashService.toDataUrl(hash)})` : null;
  });

  protected onImageLoaded(): void {
    this.loaded.set(true);
  }
}
