import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'React Native Nitro Gradients',
  tagline: 'Native linear, radial, and sweep gradients for React Native',
  favicon: 'img/logo.svg',

  // Set the production url of your site here
  url: 'https://Swami-Laxmikant.github.io',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/react-native-nitro-gradients/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'Swami-Laxmikant', // Usually your GitHub org/user name.
  projectName: 'react-native-nitro-gradients', // Usually your repo name.

  onBrokenLinks: 'throw',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          editUrl:
            'https://github.com/Swami-Laxmikant/react-native-nitro-gradients/tree/main/docs/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/docusaurus-social-card.jpg',
    colorMode: {
      defaultMode: 'light',
      disableSwitch: false,
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'Nitro Gradients',
      logo: {
        alt: 'Nitro Gradient Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Docs',
        },
{
          to: '/docs/api',
          label: 'API',
          position: 'left',
        },
        {
          href: 'https://www.npmjs.com/package/react-native-nitro-gradients',
          label: 'npm',
          position: 'right',
        },
        {
          href: 'https://github.com/Swami-Laxmikant/react-native-nitro-gradients',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'light',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Getting Started',
              to: '/docs/intro',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/Swami-Laxmikant/react-native-nitro-gradients',
            },
            {
              label: 'npm',
              href: 'https://www.npmjs.com/package/react-native-nitro-gradients',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} React Native Nitro Gradients. Built with ❤️ in <a href="https://www.google.com/search?q=Bengaluru" target="_blank" rel="noopener noreferrer">Bengaluru</a>.<br/>Special thanks to <a href="https://github.com/mrousavy" target="_blank" rel="noopener noreferrer">Marc Rousavy</a> and <a href="https://github.com/mrousavy/nitro" target="_blank" rel="noopener noreferrer">Nitro Modules</a>.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
