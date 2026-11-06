import { TestBed } from '@angular/core/testing';
import { Photos } from './photos';

describe('Photos', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [Photos] }).compileComponents();
  });

  it('should render the page heading', async () => {
    const fixture = TestBed.createComponent(Photos);
    await fixture.whenStable();
    expect((fixture.nativeElement as HTMLElement).querySelector('h1')?.textContent).toContain(
      'Photos',
    );
  });
});
