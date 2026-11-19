import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ImageTag, type ImageMetadata } from '../../../../api/generated/model';
import { provideTranslocoTesting } from '../../../../../testing/transloco-testing';
import { PhotoInfo } from './photo-info';

const image: ImageMetadata = {
  id: 'a',
  title: 'Title a',
  location: 'Warsaw',
  date: '2024-03-05T10:00:00Z',
  takenWith: 'Sony A7 III',
  width: 100,
  height: 100,
  previewUrl: 'http://x/a',
  detailedUrl: 'http://x/a/full',
  tags: [ImageTag.city, ImageTag.night],
};

describe('PhotoInfo', () => {
  let fixture: ComponentFixture<PhotoInfo>;
  let el: HTMLElement;

  const panel = (): HTMLElement => el.querySelector('.panel') as HTMLElement;
  const toggle = (): HTMLButtonElement => el.querySelector('.toggle') as HTMLButtonElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PhotoInfo],
      providers: [provideTranslocoTesting()],
    }).compileComponents();
    fixture = TestBed.createComponent(PhotoInfo);
    fixture.componentRef.setInput('image', image);
    fixture.detectChanges();
    el = fixture.nativeElement;
  });

  it('should render image details', () => {
    const text: string = el.textContent ?? '';
    expect(text).toContain('Warsaw');
    expect(text).toContain('Sony A7 III');
    expect(text).toContain('March 5, 2024');
    expect(text).toContain('Night');
  });

  it('should be closed by default and toggle on click', () => {
    expect(panel().classList).not.toContain('open');
    toggle().click();
    fixture.detectChanges();
    expect(panel().classList).toContain('open');
    expect(toggle().getAttribute('aria-expanded')).toBe('true');
    toggle().click();
    fixture.detectChanges();
    expect(panel().classList).not.toContain('open');
  });

  it('should open on mouse hover and close on leave', () => {
    const info: HTMLElement = toggle();
    info.dispatchEvent(new PointerEvent('pointerenter', { pointerType: 'mouse' }));
    fixture.detectChanges();
    expect(panel().classList).toContain('open');
    info.dispatchEvent(new PointerEvent('pointerleave'));
    fixture.detectChanges();
    expect(panel().classList).not.toContain('open');
  });

  it('should ignore touch pointer enter', () => {
    const info: HTMLElement = toggle();
    info.dispatchEvent(new PointerEvent('pointerenter', { pointerType: 'touch' }));
    fixture.detectChanges();
    expect(panel().classList).not.toContain('open');
  });

  it('should not open when hovering the hidden panel area', () => {
    panel().dispatchEvent(new PointerEvent('pointerenter', { pointerType: 'mouse' }));
    fixture.detectChanges();
    expect(panel().classList).not.toContain('open');
  });

  it('should close when clicking outside', () => {
    toggle().click();
    fixture.detectChanges();
    document.body.click();
    fixture.detectChanges();
    expect(panel().classList).not.toContain('open');
  });

  it('should close on Escape', () => {
    toggle().click();
    fixture.detectChanges();
    toggle().dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    fixture.detectChanges();
    expect(panel().classList).not.toContain('open');
  });
});
