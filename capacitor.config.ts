import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.amarascents.app',
  appName: 'Amara Scents',
  webDir: 'dist',
  server: {
    androidScheme: 'http'
  }
};

export default config;
