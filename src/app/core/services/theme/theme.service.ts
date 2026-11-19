import { DOCUMENT } from '@angular/common';
import { effect, inject, Injectable, signal, type WritableSignal } from '@angular/core';

export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly document: Document = inject(DOCUMENT);
  readonly theme: WritableSignal<Theme> = signal(this.resolveInitialTheme());

  constructor() {
    effect(() => {
      const theme = this.theme();
      this.document.documentElement.style.colorScheme = theme;
      try {
        localStorage.setItem(STORAGE_KEY, theme);
      } catch {
        // storage unavailable; preference is just not persisted
      }
    });
  }

  toggle(): void {
    this.theme.update((theme) => (theme === 'dark' ? 'light' : 'dark'));
  }

  private resolveInitialTheme(): Theme {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === 'light' || stored === 'dark') {
        return stored;
      }
    } catch {
      // ignore
    }
    return globalThis.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
}
