import { ChangeDetectionStrategy, Component, output, type OutputEmitterRef } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslocoDirective } from '@jsverse/transloco';
import { PHOTOS_SCOPE } from '../photos-scope.transloco';

@Component({
  selector: 'app-photos-empty',
  imports: [MatButtonModule, MatIconModule, TranslocoDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './photos-empty.html',
  styleUrl: './photos-empty.scss',
})
export class PhotosEmpty {
  protected readonly prefix: string = PHOTOS_SCOPE;

  readonly clearFilters: OutputEmitterRef<void> = output<void>();
}
