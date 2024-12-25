import { useData } from 'vitepress';
import { computed } from 'vue';

export const useLocale = () => {
  const { site, lang } = useData();
  const locale = computed(() => {
    const result = Object.entries(site.value.locales).find(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      ([_, v]) => v.lang === lang.value,
    );

    if (result) {
      return result[0];
    }

    throw new Error(`Locale for ${lang} not found`);
  });

  return locale;
};
