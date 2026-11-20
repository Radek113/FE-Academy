import { ImageTag, type ImageMetadata } from '../app/api/generated/model';

import { thumbhashes } from './thumbhashes';

const seeds: [string, string, ImageTag[], string][] = [
  ['Misty Pines', 'Tatra Mountains', [ImageTag.nature, ImageTag.landscape], 'Sony A7 III'],
  ['City Lights', 'Warsaw', [ImageTag.city, ImageTag.night], 'iPhone 15 Pro'],
  ['Quiet Harbor', 'Gdynia', [ImageTag.sea, ImageTag.landscape, ImageTag.travel], 'Canon EOS R6'],
  ['Street Portrait', 'Krakow', [ImageTag.portrait, ImageTag.street], 'Fujifilm X-T4'],
  ['Golden Field', 'Masovia', [ImageTag.nature, ImageTag.landscape], 'Nikon Z6 II'],
  ['Neon Rain', 'Wroclaw', [ImageTag.city, ImageTag.night, ImageTag.street], 'Pixel 8 Pro'],
  ['Alpine Lake', 'Morskie Oko', [ImageTag.nature, ImageTag.travel], 'Sony A7 III'],
  ['Window Light', 'Studio', [ImageTag.portrait], 'Canon EOS R6'],
  ['Old Town', 'Gdansk', [ImageTag.architecture, ImageTag.city, ImageTag.travel], 'iPhone 15 Pro'],
  ['Forest Fox', 'Bialowieza', [ImageTag.nature], 'Nikon Z6 II'],
];

export const images: ImageMetadata[] = Array.from({ length: 50 }, (_, i) => {
  const seed = seeds[i % seeds.length];
  if (!seed) {
    throw new Error('Mock seeds must not be empty');
  }
  const [title, location, tags, takenWith] = seed;
  const id = `image-${i + 1}`;
  const portrait = i % 3 === 0;
  const width = portrait ? 1200 : 1600;
  const height = portrait ? 1600 : 1067 + (i % 4) * 60;
  const previewWidth = 400;
  const previewHeight = Math.round((height / width) * previewWidth);
  return {
    id,
    title: `${title} ${Math.floor(i / seeds.length) + 1}`,
    location,
    date: new Date(Date.UTC(2024, i % 12, 1 + (i % 28), 10)).toISOString(),
    takenWith,
    width,
    height,
    previewUrl: `https://picsum.photos/seed/${id}/${previewWidth}/${previewHeight}`,
    detailedUrl: `https://picsum.photos/seed/${id}/${width}/${height}`,
    thumbhash: thumbhashes[id],
    tags,
  };
});
