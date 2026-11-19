import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  HostListener,
  inject,
  input,
  signal,
  type InputSignal,
  type Signal,
  type WritableSignal,
} from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { provideTranslocoScope, TranslocoDirective } from '@jsverse/transloco';
import type { ImageMetadata } from '../../../../api/generated/model';

@Component({
  selector: 'app-photo-info',
  imports: [DatePipe, MatButtonModule, MatChipsModule, MatIconModule, TranslocoDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideTranslocoScope({ scope: 'photos' })],
  templateUrl: './photo-info.html',
  styleUrl: './photo-info.scss',
})
export class PhotoInfo {
  protected readonly prefix: string = 'photos';
  private readonly host: ElementRef<HTMLElement> = inject(ElementRef);
  readonly image: InputSignal<ImageMetadata> = input.required<ImageMetadata>();

  private readonly pinned: WritableSignal<boolean> = signal<boolean>(false);
  private readonly hovered: WritableSignal<boolean> = signal<boolean>(false);
  protected readonly open: Signal<boolean> = computed(
    (): boolean => this.pinned() || this.hovered(),
  );

  protected toggle(): void {
    this.pinned.update((v: boolean): boolean => !v);
  }

  protected onPointerEnter(event: PointerEvent): void {
    if (event.pointerType === 'mouse') this.hovered.set(true);
  }

  protected onPointerLeave(): void {
    this.hovered.set(false);
  }

  @HostListener('document:click', ['$event'])
  protected onDocumentClick(event: MouseEvent): void {
    if (!this.host.nativeElement.contains(event.target as Node)) this.pinned.set(false);
  }

  protected onEscape(event: Event): void {
    if (!this.open()) return;
    event.stopPropagation();
    this.pinned.set(false);
    this.hovered.set(false);
  }
}
