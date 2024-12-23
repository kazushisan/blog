<script setup lang="ts">
import PostMetaData from './PostMetaData.vue';
import { data as posts } from './posts.data.js';
</script>

<template>
  <div class="xl:flex xl:justify-center">
    <div class="container md:mx-auto xl:mx-0 max-w-4xl flex-1 min-w-0">
      <div class="px-4">
        <div
          v-for="post in posts"
          :key="post.url"
          class="mt-8 pt-8 first-of-type:border-t-0 border-t border-slate-100"
        >
          <a :href="post.url">
            <h1 class="font-bold text-xl mb-4">{{ post.title }}</h1>
          </a>
          <PostMetaData
            :date="post.date"
            :modified-date="post.modifiedDate"
            :permalink="post.permalink"
            :hash="post.hash"
          />
        </div>
      </div>
    </div>
  </div>
</template>
