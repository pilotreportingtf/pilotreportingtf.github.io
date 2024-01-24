import path from 'path';
import { fileURLToPath } from 'url';

import { defineConfig, squooshImageService } from 'astro/config';

import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';
import partytown from '@astrojs/partytown';
import icon from 'astro-icon';
import tasks from './src/utils/tasks';

import remarkToc from 'remark-toc';
// https://github.com/josestg/rehype-figure
import rehypeFigure from 'rehype-figure';
// https://github.com/timlrx/rehype-citation
import rehypeCitation from 'rehype-citation'
// https://github.com/jaywcjlove/rehype-attr
import rehypeAttrs from 'rehype-attr';
import { rehypeHeadingIds } from '@astrojs/markdown-remark';

import { readingTimeRemarkPlugin, responsiveTablesRehypePlugin } from './src/utils/frontmatter.mjs';

import { ANALYTICS, SITE } from './src/utils/config.ts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const whenExternalScripts = (items = []) =>
  ANALYTICS.vendors.googleAnalytics.id && ANALYTICS.vendors.googleAnalytics.partytown
    ? Array.isArray(items)
      ? items.map((item) => item())
      : [items()]
    : [];

export default defineConfig({
  site: SITE.site,
  base: SITE.base,
  trailingSlash: SITE.trailingSlash ? 'always' : 'never',

  output: 'static',

  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
    sitemap(),
    mdx(),
    icon({
      include: {
        tabler: ['*'],
        'flat-color-icons': [
          'template',
          'gallery',
          'approval',
          'document',
          'advertising',
          'currency-exchange',
          'voice-presentation',
          'business-contact',
          'database',
        ],
      },
    }),

    ...whenExternalScripts(() =>
      partytown({
        config: { forward: ['dataLayer.push'] },
      })
    ),

    tasks(),
  ],

  image: {
    service: squooshImageService(),
  },

  markdown: {
    remarkPlugins: [readingTimeRemarkPlugin, remarkToc],
    rehypePlugins: [
      responsiveTablesRehypePlugin,
      rehypeHeadingIds,
      // rehypeFigure,
      [rehypeCitation, {
        "bibliography": [
          "https://raw.githubusercontent.com/timlrx/rehype-citation/main/test/references-data.bib",
          "https://raw.githubusercontent.com/timlrx/rehype-citation/main/test/CITATION.cff"
        ]
      }],
      [rehypeAttrs, { properties: 'attr' }],
      
    ],
  },

  vite: {
    resolve: {
      alias: {
        '~': path.resolve(__dirname, './src'),
      },
    },
  },
});
