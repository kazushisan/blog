<script setup lang="ts">
import { data as posts } from './posts.data.js';
</script>

<template>
  <div>
    <div v-for="post in posts" :key="post.url">
      <h2>{{ post.title }}</h2>
      <a :href="post.url">Read more</a>
    </div>
  </div>
</template>
