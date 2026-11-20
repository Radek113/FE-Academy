import { DOCUMENT } from '@angular/common';
import { effect, inject, Injectable, signal, type WritableSignal } from '@angular/core';
import { StorageService } from '../storage/storage.service';

export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly document: Document = inject(DOCUMENT);
  private readonly storage: StorageService = inject(StorageService);

  readonly theme: WritableSignal<Theme> = signal(this.resolveInitialTheme());

  constructor() {
    effect(() => {
      const theme: Theme = this.theme();
      this.document.documentElement.style.colorScheme = theme;
      this.storage.set(STORAGE_KEY, theme);
    });
  }

  toggle(): void {
    this.theme.update((theme: Theme): Theme => (theme === 'dark' ? 'light' : 'dark'));
  }

  private resolveInitialTheme(): Theme {
    const stored: string | null = this.storage.get(STORAGE_KEY);
    if (stored === 'light' || stored === 'dark') {
      return stored;
    }
    return globalThis.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
}
