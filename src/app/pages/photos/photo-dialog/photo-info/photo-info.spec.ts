import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ImageTag } from '../../../../api/generated/model';
import { makeImage } from '../../../../../testing/image-factory';
import { provideTranslocoTesting } from '../../../../../testing/transloco-testing';
import { getTst, queryAllTst } from '../../../../../testing/tst';
import { PHOTOS_SCOPE_PROVIDER } from '../../photos-scope.transloco';
import { PhotoInfo } from './photo-info';

describe('PhotoInfo', () => {
  let fixture: ComponentFixture<PhotoInfo>;
  let el: HTMLElement;

  const isOpen = (): boolean => getTst(el, 'photo-info-panel').classList.contains('open');
  const toggle = (): HTMLElement => getTst(el, 'photo-info-toggle');
  const click = (target: HTMLElement): void => {
    target.click();
    fixture.detectChanges();
  };
  const dispatch = (event: Event): void => {
    toggle().dispatchEvent(event);
    fixture.detectChanges();
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PhotoInfo],
      providers: [provideTranslocoTesting(), PHOTOS_SCOPE_PROVIDER],
    }).compileComponents();
    fixture = TestBed.createComponent(PhotoInfo);
    fixture.componentRef.setInput('image', makeImage({ tags: [ImageTag.city, ImageTag.night] }));
    fixture.detectChanges();
    el = fixture.nativeElement;
  });

  it('should render image details', () => {
    // when
    // then
    expect(getTst(el, 'photo-info-location').textContent).toBe('Warsaw');
    expect(getTst(el, 'photo-info-taken-with').textContent).toBe('Sony A7 III');
    expect(getTst(el, 'photo-info-date').textContent).toBe('March 5, 2024');
    expect(queryAllTst(el, 'photo-info-tag').map((tag) => tag.textContent?.trim())).toEqual([
      'City',
      'Night',
    ]);
  });

  it('should be closed by default and toggle on click', () => {
    // given
    const initiallyOpen = isOpen();

    // when
    click(toggle());
    const openAfterFirstClick = isOpen();
    click(toggle());

    // then
    expect(initiallyOpen).toBe(false);
    expect(openAfterFirstClick).toBe(true);
    expect(isOpen()).toBe(false);
  });

  it('should open on mouse hover and close on leave', () => {
    // when
    dispatch(new PointerEvent('pointerenter', { pointerType: 'mouse' }));
    const openOnEnter = isOpen();
    dispatch(new PointerEvent('pointerleave'));

    // then
    expect(openOnEnter).toBe(true);
    expect(isOpen()).toBe(false);
  });

  it('should ignore touch pointer enter', () => {
    // when
    dispatch(new PointerEvent('pointerenter', { pointerType: 'touch' }));

    // then
    expect(isOpen()).toBe(false);
  });

  it('should close when clicking outside', () => {
    // given
    click(toggle());

    // when
    click(document.body);

    // then
    expect(isOpen()).toBe(false);
  });

  it('should stay open when clicking inside the component', () => {
    // given
    click(toggle());

    // when
    click(getTst(el, 'photo-info-panel'));

    // then
    expect(isOpen()).toBe(true);
  });

  it('should close on Escape without letting it propagate', () => {
    // given
    click(toggle());
    const escape = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true });
    const stopPropagation = vi.spyOn(escape, 'stopPropagation');

    // when
    dispatch(escape);

    // then
    expect(isOpen()).toBe(false);
    expect(stopPropagation).toHaveBeenCalled();
  });
});
