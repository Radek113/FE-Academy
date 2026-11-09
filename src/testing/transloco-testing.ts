import { provideTransloco, type Translation, type TranslocoLoader } from '@jsverse/transloco';
import { of, type Observable } from 'rxjs';
import en from '../assets/i18n/en.json';
import photosEn from '../assets/i18n/photos/en.json';

const translations: Record<string, Translation> = {
  en,
  'photos/en': photosEn,
};

class TestingLoader implements TranslocoLoader {
  getTranslation(lang: string): Observable<Translation> {
    return of(translations[lang] ?? {});
  }
}

export const provideTranslocoTesting = (): ReturnType<typeof provideTransloco> =>
  provideTransloco({
    config: { availableLangs: ['en'], defaultLang: 'en', prodMode: true },
    loader: TestingLoader,
  });
