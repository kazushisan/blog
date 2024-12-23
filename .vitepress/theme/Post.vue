<script setup lang="ts">
import { useData } from 'vitepress';

const { frontmatter } = useData();
</script>
<template>
  <div className="xl:flex xl:justify-center">
    <div
      className="container md:mx-auto xl:mx-0 max-w-4xl box-content flex-none"
    >
      <div className="px-4">
        <header>
          <h1 className="font-bold text-3xl my-8">{{ frontmatter.title }}</h1>
          <div className="my-8">todo: post meta</div>
        </header>
        <article className="prose mb-16 max-w-none prose-slate">
          <Content />
        </article>
      </div>
    </div>
    <div className="hidden xl:block flex-none w-72">
      <div className="p-4 sticky mt-40 inset-0 max-h-screen overflow-y-scroll">
        todo: table of contents
      </div>
    </div>
  </div>
</template>
