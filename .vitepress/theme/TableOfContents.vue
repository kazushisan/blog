<script setup lang="ts">
import { useData } from 'vitepress';
import { computed, onWatcherCleanup, ref, watchPostEffect } from 'vue';

const getPosition = (element: Element) =>
  (element.previousElementSibling || element).getBoundingClientRect().bottom;

const getHeaderElements = (headers: { slug: string }[]) =>
  Array.from(
    document.querySelectorAll(headers.map(({ slug }) => `#${slug}`).join(',')),
  );

const { page } = useData();

// this should work for now because the configured level is [2, 3]
const headers = computed(() =>
  page.value.headers.flatMap(({ children, ...rest }) => [rest, ...children]),
);
const activeId = ref<string | null>(null);

watchPostEffect(() => {
  if (headers.value.length === 0) {
    return;
  }

  const observer = new IntersectionObserver(() => {
    const headerElements = getHeaderElements(headers.value);

    const firstElement = headerElements[0];

    if (headerElements.length <= 0 || !firstElement) {
      return;
    }

    const target = headerElements.reduce(
      (acc, cur) => {
        const position = getPosition(cur);

        if (position > 0 || acc.position > position) {
          return acc;
        }

        return {
          position: position,
          id: cur.id,
        };
      },
      {
        position: getPosition(firstElement),
        id: firstElement.id,
      },
    );

    if (activeId.value === target.id) {
      return;
    }

    activeId.value = target.id;
  });

  headers.value.forEach(({ slug }) => {
    const element = document.getElementById(slug);
    const sibling = element?.previousElementSibling;

    if (sibling) {
      observer.observe(sibling);

      return;
    }

    if (element) {
      observer.observe(element);
    }
  });

  onWatcherCleanup(() => observer.disconnect());
});
</script>

<template>
  <ul>
    <li v-for="header in headers" :key="header.slug">
      <a
        :href="`#${header.slug}`"
        :class="`list-none px-2 py-1 my-1 block text-sm ${
          header.level !== 2
            ? header.slug === activeId
              ? 'bg-blue-100 text-blue-500 rounded ml-2 font-bold'
              : 'text-slate-700 ml-2'
            : header.slug === activeId
              ? 'bg-blue-100 text-blue-500 rounded font-bold'
              : 'text-slate-700'
        }`"
      >
        {{ header.title }}
      </a>
    </li>
  </ul>
</template>
