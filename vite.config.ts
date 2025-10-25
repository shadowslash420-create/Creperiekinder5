import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";

// Assume cartographer and devBanner are imported elsewhere or handled by the environment
// For the purpose of this completion, we'll assume they are available in the scope
// or will be handled by the Replit environment. If they are actual imports,
// they should be added at the top like 'react' and 'runtimeErrorOverlay'.

// Placeholder for cartographer if it needs explicit import based on the provided changes
// import cartographer from "@replit/vite-plugin-cartographer";
// Placeholder for devBanner if it needs explicit import based on the provided changes
// import devBanner from "@replit/vite-plugin-dev-banner";


export default defineConfig({
  plugins: [
    // The provided changes imply cartographer and devBanner are directly available.
    // If they need explicit imports, they should be at the top.
    // For now, assuming they are directly callable as per the change snippet.
    // cartographer(),
    // devBanner(),
    react(),
    runtimeErrorOverlay(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./client/src"),
      "@shared": path.resolve(__dirname, "./shared"),
    },
  },
  root: path.resolve(__dirname, "client"),
  build: {
    outDir: path.resolve(__dirname, "dist"),
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom'],
          'vendor-ui': ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', '@radix-ui/react-select'],
          'vendor-utils': ['clsx', 'tailwind-merge', 'date-fns']
        }
      }
    }
  },
});