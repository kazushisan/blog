<script setup lang="ts">
import { useData } from 'vitepress';
import Home from './Home.vue';
import Post from './Post.vue';

const { site, frontmatter, page } = useData();
</script>

<template>
  <div>
    <header>
      <div
        :class="`container md:mx-auto max-w-4xl box-content ${frontmatter.home ? '' : 'xl:pr-72'}`"
      >
        <div class="p-4 flex justify-start items-center">
          <a href="/">
            <h1 class="font-bold text-lg">{{ site.title }}</h1></a
          >
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
              <a href="https://github.com/kazushisan/gadgetlunatic">
                github.com/kazushisan/gadgetlunatic
              </a>
            </p>
          </div>
          <div class="mt-4">
            <p>
              © 2024
              <a
                class="text-blue-500 hover:text-blue"
                href="https://x.com/kazushikonosu"
              >
                @kazushikonosu
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>
