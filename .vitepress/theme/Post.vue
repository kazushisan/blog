<script setup lang="ts">
import { useData } from 'vitepress';
import TableOfContents from './TableOfContents.vue';
import PostMetaData from './PostMetaData.vue';

const { frontmatter } = useData();
</script>
<template>
  <div class="xl:flex xl:justify-center">
    <div class="container sm:mx-auto xl:mx-0 max-w-2xl box-content flex-none">
      <div class="px-4">
        <header>
          <h1 class="font-bold text-2xl my-8">{{ frontmatter.title }}</h1>
          <div class="my-8">
            <PostMetaData
              :date="frontmatter.date"
              :modified-date="frontmatter.modifiedDate"
              :permalink="frontmatter.permalink"
              :hash="frontmatter.hash"
            />
          </div>
        </header>
        <article class="prose mb-16 max-w-none prose-slate">
          <Content />
        </article>
      </div>
    </div>
    <div class="hidden xl:block flex-none w-72">
      <div class="p-4 sticky mt-40 inset-0 max-h-screen overflow-y-scroll">
        <TableOfContents />
      </div>
    </div>
  </div>
</template>
