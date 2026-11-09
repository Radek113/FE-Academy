import { getGetImagesMetadataMockHandler } from '../app/api/generated/endpoints/images/images.msw';
import { images } from './images.data';

export const handlers = [getGetImagesMetadataMockHandler(() => images)];
