import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { provideTranslocoScope, TranslocoDirective } from '@jsverse/transloco';

@Component({
  selector: 'app-welcome',
  imports: [MatButtonModule, MatCardModule, MatIconModule, RouterLink, TranslocoDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideTranslocoScope({ scope: 'welcome' })],
  templateUrl: './welcome.html',
  styleUrl: './welcome.scss',
})
export class Welcome {
  protected readonly prefix: string = 'welcome';
  protected readonly features = [
    { icon: 'photo_library', key: 'browse' },
    { icon: 'filter_alt', key: 'filter' },
    { icon: 'info', key: 'details' },
  ];
}
