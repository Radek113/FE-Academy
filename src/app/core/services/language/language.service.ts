import { DOCUMENT } from '@angular/common';
import { computed, inject, Injectable, type Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { TranslocoService } from '@jsverse/transloco';
import { StorageService } from '../storage/storage.service';

export const SUPPORTED_LANGUAGES = ['en', 'pl'] as const;
export type Language = (typeof SUPPORTED_LANGUAGES)[number];

const DEFAULT_LANGUAGE: Language = 'en';
const STORAGE_KEY = 'language';

const isSupported = (lang: string | null | undefined): lang is Language =>
  SUPPORTED_LANGUAGES.includes(lang as Language);

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private readonly transloco: TranslocoService = inject(TranslocoService);
  private readonly document: Document = inject(DOCUMENT);
  private readonly storage: StorageService = inject(StorageService);
  private readonly activeLang: Signal<string> = toSignal(this.transloco.langChanges$, {
    initialValue: this.transloco.getActiveLang(),
  });

  readonly language: Signal<Language> = computed((): Language => {
    const active: string = this.activeLang();
    return isSupported(active) ? active : DEFAULT_LANGUAGE;
  });

  constructor() {
    this.setLanguage(this.resolveInitialLanguage());
  }

  setLanguage(lang: Language): void {
    this.transloco.setActiveLang(lang);
    this.document.documentElement.lang = lang;
    this.storage.set(STORAGE_KEY, lang);
  }

  private resolveInitialLanguage(): Language {
    const stored: string | null = this.storage.get(STORAGE_KEY);
    if (isSupported(stored)) {
      return stored;
    }
    const browser: string | undefined = globalThis.navigator?.language?.slice(0, 2).toLowerCase();
    return isSupported(browser) ? browser : DEFAULT_LANGUAGE;
  }
}
