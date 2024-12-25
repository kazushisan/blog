<script lang="ts" setup>
defineProps<{
  date: string;
  modifiedDate?: string;
  permalink?: string;
  hash?: string;
}>();

const formatDate = (raw: string) =>
  new Intl.DateTimeFormat('en-US', {
    dateStyle: 'long',
  }).format(new Date(raw));
</script>
<template>
  <div className="text-sm text-slate-500 items-center">
    <span>{{ formatDate(date) }}</span>
    <span v-if="modifiedDate" className="before:content-['·'] before:px-1">
      last updated {{ formatDate(modifiedDate) }}
    </span>
    <template v-if="permalink && hash">
      <span className="before:content-['·'] before:px-1">latest commit </span>
      <a
        className="bg-slate-50 text-sm text-slate-700 inline-block border-slate-200 border rounded-sm px-1 font-mono ml-1 align-top"
        :href="permalink"
      >
        {{ hash.slice(0, 7) }}
      </a>
    </template>
  </div>
</template>
