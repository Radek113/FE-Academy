import { DOCUMENT } from '@angular/common';
import { computed, inject, Injectable, type Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { TranslocoService } from '@jsverse/transloco';

export const SUPPORTED_LANGUAGES = ['en', 'pl'] as const;
export type Language = (typeof SUPPORTED_LANGUAGES)[number];

const STORAGE_KEY = 'language';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private readonly transloco: TranslocoService = inject(TranslocoService);
  private readonly document: Document = inject(DOCUMENT);
  private readonly activeLang: Signal<string> = toSignal(this.transloco.langChanges$, {
    initialValue: this.transloco.getActiveLang(),
  });

  readonly language: Signal<Language> = computed(() =>
    this.isSupported(this.activeLang()) ? (this.activeLang() as Language) : 'en',
  );

  constructor() {
    this.setLanguage(this.resolveInitialLanguage());
  }

  setLanguage(lang: Language): void {
    this.transloco.setActiveLang(lang);
    this.document.documentElement.lang = lang;
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // storage unavailable; preference is just not persisted
    }
  }

  private resolveInitialLanguage(): Language {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (this.isSupported(stored)) {
        return stored;
      }
    } catch {
      // ignore
    }
    const browser = globalThis.navigator?.language?.slice(0, 2).toLowerCase();
    return this.isSupported(browser) ? browser : 'en';
  }

  private isSupported(lang: string | null | undefined): lang is Language {
    return SUPPORTED_LANGUAGES.includes(lang as Language);
  }
}
