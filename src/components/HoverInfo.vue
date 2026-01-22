<template>
  <div class="relative inline-block">
    <div
      class="inline-flex items-center px-1.5 py-1.5 rounded-md bg-orange-100 border border-orange-200 opacity-80"
    >
      <img
        :src="iconSrc"
        :alt="altText"
        class="w-4 h-4 cursor-default"
        :title="tooltip"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  iconSrc: string;
  altText?: string;
  tooltip: string;
}

withDefaults(defineProps<Props>(), {
  altText: "",
});
</script>

<style scoped>
/* 悬停时保持一致的视觉效果 */
div:hover {
  opacity: 0.9;
}
</style>
