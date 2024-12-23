<script setup lang="ts">
import { useData } from 'vitepress';
import Home from './Home.vue';

// https://vitepress.dev/reference/runtime-api#usedata
const { site, frontmatter } = useData();
</script>

<template>
  <div v-if="frontmatter.home">
    <h1>{{ site.title }}</h1>
    <p>{{ site.description }}</p>
    <Home />
  </div>
  <div v-else>
    <a href="/">Home</a>
    <Content />
  </div>
</template>
