import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'org.readytoserve.foundation',
  appName: 'Ready To Serve',
  webDir: 'dist',
  server: {
    // Load the published Base44 site so /api calls and login work
    url: 'https://ready-to-serve.base44.app',
    allowNavigation: ['*.base44.app', '*.base44.com', 'base44.com'],
  },
};

export default config;
