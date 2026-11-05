// Vite serves these as URLs; TypeScript needs to know they resolve to strings.
declare module '*.ttf?url' {
  const url: string
  export default url
}

// The generator's marks are inlined as text so their colours can be swapped
// before they are rasterised.
declare module '*.svg?raw' {
  const source: string
  export default source
}
