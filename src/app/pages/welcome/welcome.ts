import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { TranslocoDirective } from '@jsverse/transloco';
import { WELCOME_SCOPE } from './welcome-scope.transloco';
import { Feature } from './models/welcome.models';

@Component({
  selector: 'app-welcome',
  imports: [MatButtonModule, MatCardModule, MatIconModule, RouterLink, TranslocoDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './welcome.html',
  styleUrl: './welcome.scss',
})
export class Welcome {
  protected readonly prefix: string = WELCOME_SCOPE;
  protected readonly features: readonly Feature[] = [
    { icon: 'photo_library', key: 'browse' },
    { icon: 'filter_alt', key: 'filter' },
    { icon: 'info', key: 'details' },
  ];
}
