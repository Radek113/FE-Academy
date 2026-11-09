import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ImageTag, type ImageMetadata } from '../../api/generated/model';
import { provideTranslocoTesting } from '../../../testing/transloco-testing';
import { Photos } from './photos';

const make = (id: string, tags: ImageTag[]): ImageMetadata => ({
  id,
  title: id,
  location: 'L',
  date: '2024-01-01T00:00:00Z',
  takenWith: 'Phone',
  width: 100,
  height: 100,
  previewUrl: `http://x/${id}`,
  detailedUrl: `http://x/${id}/full`,
  tags,
});

describe('Photos', () => {
  async function setup() {
    TestBed.configureTestingModule({
      imports: [Photos],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideTranslocoTesting()],
    });
    const fixture = TestBed.createComponent(Photos);
    const http = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
    http
      .expectOne('/images/metadata')
      .flush([make('a', [ImageTag.nature]), make('b', [ImageTag.city]), make('c', [ImageTag.sea])]);
    await fixture.whenStable();
    fixture.detectChanges();
    return fixture;
  }

  it('should render the page heading and photos', async () => {
    const fixture = await setup();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('h1')?.textContent).toContain('Photos');
    expect(el.querySelectorAll('app-photo-tile').length).toBe(3);
  });

  it('should filter by multiple selected tags', async () => {
    const fixture = await setup();
    const el = fixture.nativeElement as HTMLElement;
    const chips = Array.from(el.querySelectorAll<HTMLElement>('mat-chip-option'));
    const click = (label: string) =>
      chips
        .find((c) => c.textContent?.trim() === label)
        ?.querySelector('button')
        ?.click();
    click('Nature');
    fixture.detectChanges();
    click('City');
    fixture.detectChanges();
    expect(el.querySelectorAll('app-photo-tile').length).toBe(2);
  });
});
