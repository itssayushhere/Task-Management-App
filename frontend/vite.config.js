import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Optional: Set base path if you're deploying to a subdirectory
  base: '/',
  server: {
    // Ensure server runs on localhost (or specify your desired host)
    host: 'localhost',
    port: 3000, // Change the port if needed
    // Optional: You can add more server options here
  },
});
