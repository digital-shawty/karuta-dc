// Getting finished images out of the browser.
//
// Downloads are the one place where the file has to be exactly right, so they
// go through the same renderScene as the preview, with placeholders off.
//
// Where the file lands is the browser's business, not ours, with one
// exception: Chrome and Edge can ask the person where to put it. That needs a
// recent click to work, and rendering a dozen matchups takes longer than the
// permission lasts, so the destination is always chosen before any rendering
// starts and written to afterwards.

import { zipSync } from 'fflate'
import { renderScene } from './render'
import type { Scene } from './types'

/** The slice of the File System Access API this uses. */
interface Writable { write: (data: Blob) => Promise<void>, close: () => Promise<void> }
interface FileHandle { createWritable: () => Promise<Writable> }
type Picker = (options: {
  suggestedName: string
  types: { description: string, accept: Record<string, string[]> }[]
}) => Promise<FileHandle>

/** Somewhere to put one finished file. */
export interface SaveTarget {
  write: (blob: Blob) => Promise<void>
  /** True when the person picked the spot, rather than the browser choosing. */
  chosen: boolean
}

function stamp(): string {
  const d = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}`
    + `-${pad(d.getHours())}${pad(d.getMinutes())}`
}

/** Draw a scene at full size and hand back a PNG. */
export async function renderToBlob(scene: Scene): Promise<Blob> {
  const { w, h } = scene.canvas

  if (typeof OffscreenCanvas !== 'undefined') {
    const canvas = new OffscreenCanvas(w, h)
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('could not get a drawing context')
    await renderScene(ctx, scene)
    return canvas.convertToBlob({ type: 'image/png' })
  }

  // Older Safari: fall back to a detached element.
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('could not get a drawing context')
  await renderScene(ctx, scene)

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      blob => (blob ? resolve(blob) : reject(new Error('the canvas produced no image'))),
      'image/png',
    )
  })
}

export function saveBlob(blob: Blob, fileName: string): void {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = fileName
  document.body.append(link)
  link.click()
  link.remove()
  // Give the browser a moment to start the download before dropping the blob.
  setTimeout(() => URL.revokeObjectURL(url), 10_000)
}

const KINDS = {
  png: { description: 'PNG image', accept: { 'image/png': ['.png'] } },
  zip: { description: 'Zip archive', accept: { 'application/zip': ['.zip'] } },
} as const

/**
 * Ask where a file should go, before anything has been rendered.
 *
 * Returns nothing when the person cancelled the dialog, which is a decision
 * and not a failure: the caller should stop quietly rather than saving
 * somewhere they did not ask for. Browsers without the dialog get the usual
 * download instead, which never cancels.
 *
 * Must be called straight off the click. The dialog needs a recent one, and
 * rendering first would spend it.
 */
export async function chooseSave(fileName: string, kind: keyof typeof KINDS): Promise<SaveTarget | undefined> {
  const pick = (globalThis as { showSaveFilePicker?: Picker }).showSaveFilePicker
  if (!pick) {
    return { chosen: false, write: async blob => saveBlob(blob, fileName) }
  }

  try {
    const handle = await pick({ suggestedName: fileName, types: [KINDS[kind]] })
    return {
      chosen: true,
      write: async (blob) => {
        const file = await handle.createWritable()
        await file.write(blob)
        await file.close()
      },
    }
  }
  catch (error) {
    // A cancelled dialog throws. Anything else is a real problem with the
    // dialog itself, so fall back rather than losing the download over it.
    if ((error as { name?: string }).name === 'AbortError') return undefined
    console.warn('cc-gen: could not open the save dialog', error)
    return { chosen: false, write: async blob => saveBlob(blob, fileName) }
  }
}

export function winnersFileName(): string {
  return `winners-${stamp()}.png`
}

/** What one matchup is called, inside an archive or on its own. */
export function matchupFileName(index: number, size: string): string {
  return `matchup-${String(index + 1).padStart(2, '0')}-${size}.png`
}

/**
 * Bundle a batch into one archive.
 * Stored rather than deflated: PNG is already compressed, so squeezing it
 * again costs time and saves almost nothing.
 */
export async function zipBlobs(files: { name: string, blob: Blob }[]): Promise<Blob> {
  const entries: Record<string, [Uint8Array, { level: 0 }]> = {}
  for (const file of files) {
    entries[file.name] = [new Uint8Array(await file.blob.arrayBuffer()), { level: 0 }]
  }
  return new Blob([zipSync(entries) as unknown as BlobPart], { type: 'application/zip' })
}

export function zipFileName(): string {
  return `matchups-${stamp()}.zip`
}
