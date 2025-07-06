declare module 'jsvectormap'

// Déclarations de types pour l'application
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

// Types pour les assets
declare module '*.png'
declare module '*.jpg'
declare module '*.jpeg'
declare module '*.gif'
declare module '*.svg'
declare module '*.ico'

// Augmentation de l'interface Window pour les fonctions de diagnostic
declare global {
  interface Window {
    authDebug?: {
      checkAuth: () => any
      validateSession: () => Promise<boolean>
      logout: () => void
      clearStorage: () => void
    }
  }
}
