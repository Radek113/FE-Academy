import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

import { TranslocoDirective } from '@jsverse/transloco';

@Component({
  selector: 'app-footer',
  imports: [MatIconModule, TranslocoDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class Footer {
  protected readonly prefix: string = 'footer';
  protected readonly year = new Date().getFullYear();
}
