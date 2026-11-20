import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  input,
  signal,
  type InputSignal,
  type Signal,
  type WritableSignal,
} from '@angular/core';
import { DatePipe, DOCUMENT } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { TranslocoDirective } from '@jsverse/transloco';
import type { ImageMetadata } from '../../../../api/generated/model';
import { PHOTOS_SCOPE } from '../../photos-scope.transloco';

@Component({
  selector: 'app-photo-info',
  imports: [DatePipe, MatButtonModule, MatChipsModule, MatIconModule, TranslocoDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './photo-info.html',
  styleUrl: './photo-info.scss',
})
export class PhotoInfo {
  private readonly host: ElementRef<HTMLElement> = inject(ElementRef);
  private readonly document: Document = inject(DOCUMENT);
  private readonly pinned: WritableSignal<boolean> = signal<boolean>(false);
  private readonly hovered: WritableSignal<boolean> = signal<boolean>(false);

  protected readonly prefix: string = PHOTOS_SCOPE;
  protected readonly open: Signal<boolean> = computed(
    (): boolean => this.pinned() || this.hovered(),
  );

  readonly image: InputSignal<ImageMetadata> = input.required<ImageMetadata>();

  constructor() {
    // Listen for outside clicks only while the panel is pinned open.
    effect((onCleanup) => {
      if (!this.pinned()) {
        return;
      }
      const onDocumentClick = (event: MouseEvent): void => {
        if (!this.host.nativeElement.contains(event.target as Node)) {
          this.pinned.set(false);
        }
      };
      this.document.addEventListener('click', onDocumentClick);
      onCleanup((): void => this.document.removeEventListener('click', onDocumentClick));
    });
  }

  protected toggle(): void {
    this.pinned.update((value: boolean): boolean => !value);
  }

  protected onPointerEnter(event: PointerEvent): void {
    if (event.pointerType === 'mouse') {
      this.hovered.set(true);
    }
  }

  protected onPointerLeave(): void {
    this.hovered.set(false);
  }

  protected onEscape(event: Event): void {
    if (!this.open()) {
      return;
    }
    event.stopPropagation();
    this.pinned.set(false);
    this.hovered.set(false);
  }
}
