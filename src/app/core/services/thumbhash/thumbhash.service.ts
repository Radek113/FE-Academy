import { Injectable } from '@angular/core';
import { thumbHashToDataURL } from 'thumbhash';

@Injectable({ providedIn: 'root' })
export class ThumbhashService {
  private readonly cache: Map<string, string> = new Map<string, string>();

  toDataUrl(hash: string): string {
    const cached: string | undefined = this.cache.get(hash);
    if (cached) {
      return cached;
    }
    const bytes: Uint8Array = Uint8Array.from(atob(hash), (c: string): number => c.charCodeAt(0));
    const url: string = thumbHashToDataURL(bytes);
    this.cache.set(hash, url);
    return url;
  }
}
