import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    headers: {
      'Content-Security-Policy': [
      "default-src 'self'",  
      "script-src 'self' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline' fonts.googleapis.com",
      "img-src 'self' data: https://intex2movieposters.blob.core.windows.net", 
      "font-src 'self' fonts.gstatic.com data:",
      "connect-src 'self' https://localhost:5000 https://api.byjacobthomas.com https://api2.byjacobthomas.com https://api.openai.com/v1/chat/completions",
      "frame-ancestors 'none'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'"
      ].join("; ")
    }
  }
});