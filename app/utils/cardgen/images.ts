// Turning files into things the renderer can draw, and cleaning up after.
//
// Every asset holds an object URL. The browser will not reclaim the blob
// behind one until it is revoked, so anything that drops an asset must call
// `revokeAsset`. Decoded images are cached by URL, which is why the cache is
// keyed on `src` and cleared alongside.

import type { ImageAsset } from './types'

const decoded = new Map<string, HTMLImageElement>()

/** Read a picked or dropped file, keeping its blob and natural size. */
export async function readImageAsset(file: Blob): Promise<ImageAsset> {
  const bitmap = await createImageBitmap(file)
  const { width, height } = bitmap
  bitmap.close()
  return { src: URL.createObjectURL(file), blob: file, width, height }
}

/** Decode once, then reuse. Canvas work needs a settled image, not a URL. */
export async function loadImage(src: string): Promise<HTMLImageElement> {
  const cached = decoded.get(src)
  if (cached) return cached

  const img = new Image()
  img.src = src
  await img.decode()
  decoded.set(src, img)
  return img
}

/**
 * Which of `gone` nothing holds any more, and so can be released.
 *
 * Asked as a set, never slot by slot. Cards move by swapping places, so a
 * slot comparison answers "is this the same card as before" when the question
 * is "has this card gone anywhere". Swap two cards and every slot looks
 * replaced, which would revoke the object URLs of two pictures still on
 * screen and leave a matchup full of broken images.
 */
export function released<T>(
  gone: readonly (T | undefined)[],
  kept: readonly (T | undefined)[],
): T[] {
  const held = new Set(kept)
  const out: T[] = []
  for (const item of gone) {
    if (item !== undefined && !held.has(item) && !out.includes(item)) out.push(item)
  }
  return out
}

/** Drop an asset. Safe to call with nothing, which keeps callers tidy. */
export function revokeAsset(asset?: { src: string } | null): void {
  if (!asset) return
  decoded.delete(asset.src)
  URL.revokeObjectURL(asset.src)
}

/**
 * Whether this is something `readImageAsset` stands a chance with.
 *
 * The browser reports a type for anything it recognises, so this catches the
 * ordinary mistake: picking a PDF, a zip, a video. It is a filter rather than
 * a promise, since a truncated PNG passes here and still fails to decode,
 * which is why every reader catches as well.
 */
export function isImageFile(file: Blob): boolean {
  return file.type.startsWith('image/')
}

/**
 * The formats a visitor is told about when they pick something else.
 * Everything a canvas can be handed; the browser decodes all of them.
 */
export const IMAGE_FORMATS = '.jpg, .png, .gif, .webp, .avif, .bmp'

/**
 * Where the files shipped in public/ actually live.
 *
 * GitHub Pages serves this project from /karuta-dc/ rather than a domain
 * root, and a site embedding the tool moves it again, so the leading slash
 * these paths are written with is not enough on its own. The app says where
 * it is once, at startup; the checks never do, and read the same paths off
 * disk unchanged.
 */
let publicBase = ''

export function setPublicBase(base: string): void {
  publicBase = base.replace(/\/+$/, '')
}

/**
 * A path under public/, pointed at wherever that turned out to be.
 * Only for files shipped in public/: an object URL is already absolute and
 * must never come through here.
 */
export function publicUrl(path: string): string {
  return publicBase + path
}
