import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import legacy from '@vitejs/plugin-legacy'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // Génère automatiquement une version "legacy" du bundle avec les
    // polyfills nécessaires (pas seulement la syntaxe transpilée) pour les
    // vieux moteurs JavaScript (ex: WebView Android ancien, courant sur les
    // téléphones sans accès Play Store type Huawei récents, ou d'entrée de
    // gamme). Le navigateur choisit automatiquement la bonne version.
    legacy({
      targets: ['Chrome >= 60', 'defaults', 'not dead']
    })
  ],
})
