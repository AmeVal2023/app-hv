//capacitor.config.ts
import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.ionichv',
  appName: 'hv',
  webDir: 'www',
  server:{
    androidScheme: 'https'
  },
  plugins: {
    FacebookLogin: {
      appId: '1004475018374070',
      appName: 'HV',
    },
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"],
    },
  },
};

export default config;
