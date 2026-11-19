import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ImageTag, type ImageMetadata } from '../../../api/generated/model';
import { PhotoTile } from './photo-tile';

const image: ImageMetadata = {
  id: 'a',
  title: 'Title',
  location: 'L',
  date: '2024-01-01T00:00:00Z',
  takenWith: 'Phone',
  width: 400,
  height: 300,
  previewUrl: 'http://x/a',
  detailedUrl: 'http://x/a/full',
  thumbhash: 'nwgeDQJ6eI+Hd3Z4h4eIiHlflPh2',
  tags: [ImageTag.nature],
};

describe('PhotoTile', () => {
  let fixture: ComponentFixture<PhotoTile>;
  let el: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [PhotoTile] }).compileComponents();
    fixture = TestBed.createComponent(PhotoTile);
    fixture.componentRef.setInput('image', image);
    fixture.detectChanges();
    el = fixture.nativeElement;
  });

  it('should render the preview image with alt text', () => {
    const img: HTMLImageElement = el.querySelector('img') as HTMLImageElement;
    expect(img.getAttribute('src')).toBe(image.previewUrl);
    expect(img.alt).toBe(image.title);
  });

  it('should show the thumbhash placeholder as background', () => {
    const button: HTMLButtonElement = el.querySelector('button') as HTMLButtonElement;
    expect(button.style.backgroundImage).toContain('data:image/png;base64');
  });

  it('should fade the image in once loaded', () => {
    const img: HTMLImageElement = el.querySelector('img') as HTMLImageElement;
    expect(img.classList).toContain('loading');
    img.dispatchEvent(new Event('load'));
    fixture.detectChanges();
    expect(img.classList).not.toContain('loading');
  });

  it('should emit opened on click', () => {
    let count = 0;
    fixture.componentInstance.opened.subscribe((): void => {
      count++;
    });
    (el.querySelector('button') as HTMLButtonElement).click();
    expect(count).toBe(1);
  });
});
