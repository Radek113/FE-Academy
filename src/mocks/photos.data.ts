import type { PhotoContent } from '../app/api/generated/model';

const seeds: [string, string, string[], string][] = [
  ['Misty Pines', 'Morning fog in the forest', ['nature', 'landscape'], 'Tatra Mountains'],
  ['City Lights', 'Long exposure of downtown traffic', ['city', 'night'], 'Warsaw'],
  ['Quiet Harbor', 'Fishing boats at dawn', ['sea', 'landscape'], 'Gdynia'],
  ['Street Portrait', 'Candid portrait in the old town', ['portrait', 'city'], 'Krakow'],
  ['Golden Field', 'Wheat at sunset', ['nature', 'landscape'], 'Masovia'],
  ['Neon Rain', 'Rainy evening reflections', ['city', 'night'], 'Wroclaw'],
  ['Alpine Lake', 'Still water below the peaks', ['nature', 'landscape'], 'Morskie Oko'],
  ['Window Light', 'Natural light portrait', ['portrait'], 'Studio'],
];

export const photos: PhotoContent[] = Array.from({ length: 24 }, (_, i) => {
  const [title, description, tags, location] = seeds[i % seeds.length];
  const id = `photo-${i + 1}`;
  const portrait = i % 3 === 0;
  return {
    id,
    title: `${title} ${Math.floor(i / seeds.length) + 1}`,
    description,
    imageUrl: `https://picsum.photos/seed/${id}/${portrait ? '1200/1600' : '1600/1067'}`,
    width: portrait ? 1200 : 1600,
    height: portrait ? 1600 : 1067,
    tags,
    takenAt: new Date(Date.UTC(2024, i % 12, 1 + i)).toISOString(),
    location,
    exif: {
      camera: 'Sony A7 III',
      lens: '35mm f/1.8',
      iso: 100 * (1 + (i % 8)),
      aperture: 'f/2.8',
      shutterSpeed: '1/250',
      focalLength: '35mm',
    },
  };
});
