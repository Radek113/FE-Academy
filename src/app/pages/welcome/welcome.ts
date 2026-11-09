import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { TranslocoDirective } from '@jsverse/transloco';

@Component({
  selector: 'app-welcome',
  imports: [MatButtonModule, MatCardModule, MatIconModule, RouterLink, TranslocoDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './welcome.html',
  styleUrl: './welcome.css',
})
export class Welcome {
  protected readonly prefix: string = 'welcome';
  protected readonly features = [
    { icon: 'photo_library', key: 'browse' },
    { icon: 'filter_alt', key: 'filter' },
    { icon: 'person', key: 'about' },
  ];
}
