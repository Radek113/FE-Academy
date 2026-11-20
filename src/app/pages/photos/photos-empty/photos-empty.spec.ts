import { TestBed } from '@angular/core/testing';
import { provideTranslocoTesting } from '../../../../testing/transloco-testing';
import { getTst } from '../../../../testing/tst';
import { PHOTOS_SCOPE_PROVIDER } from '../photos-scope.transloco';
import { PhotosEmpty } from './photos-empty';

describe('PhotosEmpty', () => {
  it('should emit clearFilters when the button is clicked', () => {
    // given
    TestBed.configureTestingModule({
      imports: [PhotosEmpty],
      providers: [provideTranslocoTesting(), PHOTOS_SCOPE_PROVIDER],
    });
    const fixture = TestBed.createComponent(PhotosEmpty);
    const emitted = vi.fn();
    fixture.componentInstance.clearFilters.subscribe(emitted);
    fixture.detectChanges();

    // when
    getTst<HTMLButtonElement>(fixture.nativeElement, 'photos-empty-clear').click();

    // then
    expect(emitted).toHaveBeenCalledTimes(1);
  });
});
