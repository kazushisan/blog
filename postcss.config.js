import tailwind from 'tailwindcss';
import typography from '@tailwindcss/typography';

export default {
  plugins: [
    tailwind({
      content: ['./.vitepress/theme/**/*.vue'],
      plugins: [typography],
    }),
  ],
};
