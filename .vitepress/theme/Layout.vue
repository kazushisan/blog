<script setup lang="ts">
import { useData } from 'vitepress';
import Home from './Home.vue';
import Post from './Post.vue';
import { useLocale } from './locale';
import { computed } from 'vue';

const { site, frontmatter, page, theme } = useData();
const locale = useLocale();
const repositoryLabel = computed(() => {
  const url = new URL(theme.value.repositoryUrl);
  return `${url.hostname}${url.pathname}`;
});
</script>

<template>
  <div>
    <header>
      <div
        :class="`container md:mx-auto max-w-4xl box-content ${frontmatter.home ? '' : 'xl:pr-72'}`"
      >
        <div class="p-4 flex justify-start items-center">
          <a :href="`/${locale}`">
            <h1 class="font-bold text-lg">{{ site.title }}</h1>
          </a>
          <div class="flex gap-1 ml-4">
            <a
              v-for="(_, k) in site.locales"
              :key="k"
              :href="`/${k}`"
              :class="`flex-1 font-sans ${k === locale ? 'text-slate-900' : 'text-slate-400'}`"
            >
              {{ k }}
            </a>
          </div>
        </div>
      </div>
    </header>
    <div
      v-if="page.isNotFound"
      className="container md:mx-auto max-w-4xl box-content xl:pr-72"
    >
      <div class="p-4 text-lg">404 Page Not Found</div>
    </div>
    <Home v-else-if="frontmatter.home" />
    <Post v-else />
    <footer>
      <div
        :class="`container md:mx-auto max-w-4xl box-content py-16 ${
          frontmatter.home ? '' : 'xl:pr-72'
        }`"
      >
        <div class="p-4">
          <div>
            <h3 class="font-bold text-lg">{{ site.title }}</h3>
            <p>
              <a :href="theme.repositoryUrl">
                {{ repositoryLabel }}
              </a>
            </p>
          </div>
          <div class="mt-4">
            <p>
              © 2024
              <a
                class="text-blue-500 hover:text-blue"
                :href="`https://x.com/${theme.x}`"
              >
                @{{ theme.x }}
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>
