import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
  type InputSignal,
  type OutputEmitterRef,
  type Signal,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule, type MatChipSelectionChange } from '@angular/material/chips';
import { provideTranslocoScope, TranslocoDirective } from '@jsverse/transloco';
import type { ImageTag } from '../../../api/generated/model';

@Component({
  selector: 'app-photo-filter',
  imports: [MatChipsModule, MatButtonModule, TranslocoDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideTranslocoScope({ scope: 'photos' })],
  templateUrl: './photo-filter.html',
  styleUrl: './photo-filter.scss',
})
export class PhotoFilter {
  protected readonly prefix: string = 'photos';

  readonly tags: InputSignal<readonly ImageTag[]> = input.required<readonly ImageTag[]>();
  readonly selectedTags: InputSignal<readonly ImageTag[]> = input<readonly ImageTag[]>([]);
  readonly selectedTagsChange: OutputEmitterRef<readonly ImageTag[]> =
    output<readonly ImageTag[]>();

  protected readonly hasSelection: Signal<boolean> = computed(
    (): boolean => this.selectedTags().length > 0,
  );

  protected isSelected(tag: ImageTag): boolean {
    return this.selectedTags().includes(tag);
  }

  protected onChipChange(event: MatChipSelectionChange, tag: ImageTag): void {
    if (event.isUserInput) {
      this.toggle(tag);
    }
  }

  private toggle(tag: ImageTag): void {
    const selected: readonly ImageTag[] = this.selectedTags();
    this.selectedTagsChange.emit(
      selected.includes(tag)
        ? selected.filter((t: ImageTag): boolean => t !== tag)
        : [...selected, tag],
    );
  }

  protected clear(): void {
    this.selectedTagsChange.emit([]);
  }
}
