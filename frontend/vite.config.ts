import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    headers: {
      'Content-Security-Policy': [
        "default-src 'self';",
        "script-src 'self' 'unsafe-inline';", // Remove 'unsafe-inline' if possible
        "style-src 'self' 'unsafe-inline';", // Needed for inline styles in React apps
        "img-src 'self' data:;", // Allow data URLs for images
        "font-src 'self' data:;", // Allow self-hosted and data URI fonts
        "connect-src 'self' https://localhost:5000 https://api.byjacobthomas.com;", // Allow API calls
        "frame-ancestors 'none';", // Prevent embedding in iframes
        "object-src 'none';", // Blocks Flash, ActiveX, etc.
        "base-uri 'self';",
        "form-action 'self';"
      ].join(" ")
    }
  }
});
