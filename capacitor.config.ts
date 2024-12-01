import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.ionichv',
  appName: 'hv',
  webDir: 'www',
  plugins: {
    FacebookLogin: {
      appId: '1004475018374070',
      appName: 'HV',
    },
  },
};

export default config;
