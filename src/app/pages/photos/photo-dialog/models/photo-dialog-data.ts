import type { ImageMetadata } from '../../../../api/generated/model';

export interface PhotoDialogData {
  images: ImageMetadata[];
  index: number;
}
