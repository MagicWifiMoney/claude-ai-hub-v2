import { defineConfig } from 'vite'

export default defineConfig({
  root: '.',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      input: {
        main: 'index.html',
        pricing: 'pricing.html',
        'blog-index': 'blog/index.html',
        'blog-post': 'blog/post-template.html',
        'dashboard-index': 'dashboard/index.html',
        'dashboard-prompts': 'dashboard/prompts.html',
        'dashboard-workflows': 'dashboard/workflows.html',
        'dashboard-tools': 'dashboard/tools.html',
        'dashboard-university': 'dashboard/university.html',
        'dashboard-admin': 'dashboard/admin/index.html',
        'public-prompt': 'p/prompt.html'
      }
    }
  },
  server: {
    port: 3000,
    open: true
  }
})