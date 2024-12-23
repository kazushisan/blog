<script setup lang="ts">
import { data as posts } from './posts.data.js';
</script>

<template>
  <div className="xl:flex xl:justify-center">
    <div className="container md:mx-auto xl:mx-0 max-w-4xl flex-1 min-w-0">
      <div className="px-4">
        <div
          v-for="post in posts"
          :key="post.url"
          className="mt-8 pt-8 first-of-type:border-t-0 border-t border-slate-100"
        >
          <a :href="post.url">
            <h1 className="font-bold text-xl mb-4">{{ post.title }}</h1>
          </a>
          <!-- todo: add post meta -->
        </div>
      </div>
    </div>
  </div>
</template>
