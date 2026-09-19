import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import { unified } from '@astrojs/markdown-remark';
import sitemap from '@astrojs/sitemap';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
export default defineConfig({
  site: process.env.SITE_URL || 'https://aryaa207.github.io',
  base: process.env.BASE_PATH || '/', output: 'static', trailingSlash: 'always',
  integrations: [mdx(), sitemap()],
  markdown: { processor: unified({ remarkPlugins: [remarkMath], rehypePlugins: [rehypeKatex] }) },
  build: { inlineStylesheets: 'never' },
  security: { csp: {
    directives: ["default-src 'self'", "img-src 'self' data: blob:", "font-src 'self'", "media-src 'self' blob:", "connect-src 'self' blob:", "worker-src 'self' blob:", "frame-src https://www.youtube-nocookie.com https://player.vimeo.com", "object-src 'none'", "base-uri 'self'", "form-action 'none'"],
    scriptDirective: { resources: ["'self'", "'wasm-unsafe-eval'"] },
    styleDirective: { resources: ["'self'", "'unsafe-inline'"] },
  } }, devToolbar: { enabled: false },
});
