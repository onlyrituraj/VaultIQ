import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vitejs.dev/config/
export default defineConfig({
  // Build configuration
  build: {
    outDir: "build",
    chunkSizeWarningLimit: 2000,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['lucide-react'],
          web3: ['@reown/appkit', 'wagmi', 'viem'],
          supabase: ['@supabase/supabase-js', '@supabase/auth-ui-react']
        }
      }
    }
  },
  
  // Plugins
  plugins: [
    tsconfigPaths(), 
    react({
      // Add React refresh for better development experience
      fastRefresh: true
    })
  ],
  
  // Development server
  server: {
    port: 4028,
    host: "0.0.0.0",
    strictPort: true,
    allowedHosts: ['.amazonaws.com', '.builtwithrocket.new', '.netlify.app']
  },
  
  // Preview server (for production builds)
  preview: {
    port: 4028,
    host: "0.0.0.0"
  },
  
  // Dependency optimization
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'lucide-react'
    ],
    exclude: [
      '@noble/hashes',
      '@walletconnect/ethereum-provider',
      '@walletconnect/relay-auth',
      '@walletconnect/core',
      '@walletconnect/utils',
      '@reown/appkit-utils',
      'viem',
      'lit-html',
      'readable-stream',
      '@coinbase/wallet-sdk',
      'dayjs'
    ]
  },
  
  // Define global constants
  define: {
    global: 'globalThis',
  },
  
  // Resolve configuration
  resolve: {
    alias: {
      // Add any path aliases if needed
      '@': '/src',
      'components': '/src/components',
      'pages': '/src/pages',
      'utils': '/src/utils',
      'contexts': '/src/contexts'
    }
  }
});