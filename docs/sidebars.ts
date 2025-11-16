import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */
const sidebars: SidebarsConfig = {
  tutorialSidebar: [
    'installation',
    'intro',
    // 'api',
    {
      type: 'category',
      label: 'Core Concepts',
      items: [
        'types',
        // 'under-the-hood',
      ],
    },
    {
      type: 'category',
      label: 'Components',
      items: [
        'linear-gradient',
        'radial-gradient',
        'sweep-gradient',
      ],
    },
    'animations',
    'without-reanimated',
  ],
};

export default sidebars;
