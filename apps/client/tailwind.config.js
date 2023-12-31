/** @type {import('tailwindcss').Config} */
const plugin = require('tailwindcss/plugin')
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    spacing: {
      0: '0',
      1: '4px',
      2: '8px',
      3: '12px',
      4: '16px',
      5: '20px',
      6: '24px',
      7: '32px',
      8: '40px',
      9: '48px',
      10: '64px',
      11: '80px',
      12: '96px',
      13: '128px',
      14: '160px',
      15: '192px',
      16: '224px',
      17: '256px',
      18: '320px',
      19: '512px',
    },
    colors: {
      orange: {
        dark: {
          25: '#FFF9F5',
          50: '#FFF4ED',
          100: '#FFE6D5',
          200: '#FFD6AE',
          300: '#FF9C66',
          400: '#FF692E',
          500: '#FF4405',
          600: '#E62E05',
          700: '#BC1B06',
          800: '#97180C',
          900: '#771A0D',
        },
      },
      primary: {
        25: '#F5F8FF',
        50: '#EFF4FF',
        100: '#D1E9FF',
        200: '#B2DDFF',
        300: '#84ADFF',
        400: '#528BFF',
        500: '#2970FF',
        600: '#155EEF',
        700: '#004EEB',
        800: '#0040C1',
        900: '#00359E',
      },
      gray: {
        25: '#FCFCFD',
        50: '#F9FAFB',
        100: '#F2F4F7',
        200: '#EAECF0',
        300: '#D0D5DD',
        400: '#98A2B3',
        500: '#667085',
        600: '#475467',
        700: '#344054',
        800: '#1D2939',
        900: '#101828',
      },
      error: {
        25: '#FFFBFA',
        50: '#FEF3F2',
        100: '#FEE4E2',
        200: '#FECDCA',
        300: '#FDA29B',
        400: '#F97066',
        500: '#F04438',
        600: '#D92D20',
        700: '#B42318',
        800: '#912018',
        900: '#7A271A',
      },
      success: {
        25: '#F6FEF9',
        50: '#ECFDF3',
        100: '#D1FADF',
        200: '#A6F4C5',
        300: '#6CE9A6',
        400: '#32D583',
        500: '#12B76A',
        600: '#039855',
        700: '#027A48',
        800: '#05603A',
        900: '#054F31',
      },
      warning: {
        25: '#FFFCF5',
        50: '#FFFAEB',
        100: '#FEF0C7',
        200: '#FEDF89',
        300: '#FEC84B',
        400: '#FDB022',
        500: '#F79009',
        600: '#DC6803',
        700: '#B54708',
        800: '#93370D',
        900: '#7A2E0E',
      },
      purple: {
        25: '#FAFAFF',
        50: '#F4F3FF',
        100: '#EBE9FE',
        200: '#D9D6FE',
        300: '#BDB4FE',
        400: '#9B8AFB',
        500: '#7A5AF8',
        600: '#6938EF',
        700: '#5925DC',
        800: '#4A1FB8',
        900: '#3E1C96',
      },
      base: {
        white: '#FFFFFF',
        black: '#000000',
      },
    },
    extend: {
      boxShadow: {
        border: '0 0 100px 10px rgba(255, 255, 255)',
        borderXl: '0 0 500px 35px rgba(255, 255, 255)',
      },
      borderWidth: {
        1: '1px',
      },
      borderRadius: {
        xxl: '32px',
      },
    },
  },
  experimental: {
    classRegex: ['cva\\(([^)]*)\\)', '["\'`]([^"\'`]*).*?["\'`]'],
  },
  plugins: [
    plugin(({ addBase, theme }) => {
      addBase({
        body: {
          backgroundColor: theme('colors.base.black'),
          width: '100vw',
          height: '100vh',
        },
        p: {
          color: theme('colors.base.white'),
        },
        h1: { color: theme('colors.base.white') },
        h2: { color: theme('colors.base.white') },
        h3: { color: theme('colors.base.white') },
        h4: { color: theme('colors.base.white') },
        h5: { color: theme('colors.base.white') },
        button: {
          color: theme('colors.base.white'),
        },
      })
    }),
  ],
}
