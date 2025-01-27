import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  build: {
    outDir: 'dist'
  },
  server: {
    port: process.env.PORT || 5173,
    host: '0.0.0.0',
    allowedHosts: [
      'racquet-rental-1.onrender.com',
      'localhost',
      '127.0.0.1'
    ]
  },
  preview: {
    port: process.env.PORT || 5173,
    host: '0.0.0.0',
    allowedHosts: [
      'racquet-rental-1.onrender.com',
      'localhost',
      '127.0.0.1'
    ]
  }
});
