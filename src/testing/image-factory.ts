import { ImageTag, type ImageMetadata } from '../app/api/generated/model';

let sequence = 0;

export const makeImage = (overrides: Partial<ImageMetadata> = {}): ImageMetadata => {
  const id: string = overrides.id ?? `image-${++sequence}`;
  return {
    id,
    title: `Title ${id}`,
    location: 'Warsaw',
    date: '2024-03-05T10:00:00Z',
    takenWith: 'Sony A7 III',
    width: 400,
    height: 300,
    previewUrl: `http://localhost/${id}`,
    detailedUrl: `http://localhost/${id}/full`,
    tags: [ImageTag.city],
    ...overrides,
  };
};
