import typography from '@tailwindcss/typography';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      typography: (theme) => ({
        DEFAULT: {
          css: {
            a: {
              textDecoration: 'none',
              fontWeight: theme('fontWeight.bold'),
              color: theme('colors.blue.500'),
              '&:hover': {
                color: theme('colors.blue.600'),
              },
              '&.heading-anchor': {
                fontWeight: 'inherit',
                color: 'inherit',
              },
            },
          },
        },
      }),
    },
  },
  plugins: [typography],
};
