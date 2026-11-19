import { inject, Injectable } from '@angular/core';
import type { Observable } from 'rxjs';
import { ImagesService } from '../../../api/generated/endpoints';
import type { ImageMetadata } from '../../../api/generated/model';

@Injectable({ providedIn: 'root' })
export class ImageMetadataService {
  private readonly imagesService: ImagesService = inject(ImagesService);

  getImages(): Observable<ImageMetadata[]> {
    return this.imagesService.getImagesMetadata();
  }
}
