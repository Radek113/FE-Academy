import { http, HttpResponse } from 'msw';
import { getGetPhotoPreviewsMockHandler } from '../app/api/generated/endpoints/photos/photos.msw';
import type { PhotoPreview } from '../app/api/generated/model';
import { photos } from './photos.data';

const previews: PhotoPreview[] = photos.map((p) => ({
  id: p.id,
  title: p.title,
  thumbnailUrl: p.imageUrl.replace(/\/\d+\/\d+$/, p.width > p.height ? '/400/267' : '/300/400'),
  width: p.width > p.height ? 400 : 300,
  height: p.width > p.height ? 267 : 400,
  tags: p.tags,
  takenAt: p.takenAt,
}));

export const handlers = [
  getGetPhotoPreviewsMockHandler(({ request }) => {
    const url = new URL(request.url);
    const tag = url.searchParams.get('tag');
    const page = Number(url.searchParams.get('page') ?? 1);
    const pageSize = Number(url.searchParams.get('pageSize') ?? 20);
    const filtered = tag ? previews.filter((p) => p.tags.includes(tag)) : previews;
    return {
      items: filtered.slice((page - 1) * pageSize, page * pageSize),
      page,
      pageSize,
      total: filtered.length,
    };
  }),
  http.get('*/photos/:id/content', ({ params }) => {
    const photo = photos.find((p) => p.id === params['id']);
    return photo
      ? HttpResponse.json(photo)
      : HttpResponse.json({ message: 'Photo not found' }, { status: 404 });
  }),
];
