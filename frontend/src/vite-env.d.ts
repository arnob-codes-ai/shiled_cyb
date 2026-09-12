/// <reference types="vite/client" />

declare module '*.geojson' {
  const value: any
  export default value
}

declare module '*.topojson' {
  const value: any
  export default value
}
