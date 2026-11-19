import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslocoDirective } from '@jsverse/transloco';
import { RouterLink, RouterLinkActive } from '@angular/router';
import {
  LanguageService,
  SUPPORTED_LANGUAGES,
} from '../../core/services/language/language.service';
import { ThemeService } from '../../core/services/theme/theme.service';

@Component({
  selector: 'app-header',
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatTooltipModule,
    RouterLink,
    RouterLinkActive,
    TranslocoDirective,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  protected readonly prefix: string = 'header';
  protected readonly languageService: LanguageService = inject(LanguageService);
  protected readonly themeService: ThemeService = inject(ThemeService);
  protected readonly languages = SUPPORTED_LANGUAGES;
  protected readonly links = [
    { path: '/', labelKey: 'links.home', icon: 'home', exact: true },
    { path: '/photos', labelKey: 'links.photos', icon: 'photo_library', exact: false },
  ];
}
