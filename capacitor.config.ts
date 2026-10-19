import type { CapacitorConfig } from '@capacitor/cli';

// Set CAP_SERVER_URL (e.g. http://localhost:5173) when running `npx cap sync ios`
// to load a local `npm run dev` server instead of the published site.
const devServerUrl = process.env.CAP_SERVER_URL;

const config: CapacitorConfig = {
  appId: 'org.readytoserve.foundation',
  appName: 'Ready To Serve',
  webDir: 'dist',
  server: devServerUrl
    ? { url: devServerUrl, cleartext: true }
    : {
        // Load the published Base44 site so /api calls and login work
        url: 'https://ready-to-serve.base44.app',
        allowNavigation: ['*.base44.app', '*.base44.com', 'base44.com'],
      },
  plugins: {
    PushNotifications: {
      // Show alerts even while the app is open
      presentationOptions: ['badge', 'sound', 'alert'],
    },
  },
};

export default config;
