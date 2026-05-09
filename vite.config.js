import { defineConfig } from 'vite'

export default defineConfig({
  root: 'src',
  base: process.env.NODE_ENV === 'production' ? '/parenthese-hygieniste/' : '/',
  publicDir: '../public',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
  },
})
