import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  // Identifiant unique de l'app — définitif une fois publié sur le Play Store,
  // choisis-le avec soin (format reverse-domain).
  appId: 'com.mac.cartecitoyenne',
  appName: 'Carte Citoyenne',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
