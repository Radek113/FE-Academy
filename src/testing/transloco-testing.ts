import { provideTransloco, type Translation, type TranslocoLoader } from '@jsverse/transloco';
import { of, type Observable } from 'rxjs';
import en from '../assets/i18n/en.json';
import pl from '../assets/i18n/pl.json';
import photosEn from '../assets/i18n/photos/en.json';
import photosPl from '../assets/i18n/photos/pl.json';

const translations: Record<string, Translation> = {
  en,
  pl,
  'photos/en': photosEn,
  'photos/pl': photosPl,
};

class TestingLoader implements TranslocoLoader {
  getTranslation(lang: string): Observable<Translation> {
    return of(translations[lang] ?? {});
  }
}

export const provideTranslocoTesting = (): ReturnType<typeof provideTransloco> =>
  provideTransloco({
    config: { availableLangs: ['en', 'pl'], defaultLang: 'en', prodMode: true },
    loader: TestingLoader,
  });
