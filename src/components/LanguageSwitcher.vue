<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { useI18n } from "../composables/useI18n"; // 确保路径对应你的实际位置
import type { Locale } from "../types/i18n";

const { locale, setLocale, availableLocales } = useI18n();

const isOpen = ref(false);
const containerRef = ref<HTMLElement | null>(null);

// 切换显示
const toggle = () => (isOpen.value = !isOpen.value);

// 选择语言
const handleSelect = (lang: Locale) => {
  setLocale(lang);
  isOpen.value = false;
};

// 点击外部自动关闭 (精简版)
const handleClickOutside = (e: MouseEvent) => {
  if (
    isOpen.value &&
    containerRef.value &&
    !containerRef.value.contains(e.target as Node)
  ) {
    isOpen.value = false;
  }
};

onMounted(() => window.addEventListener("click", handleClickOutside));
onUnmounted(() => window.removeEventListener("click", handleClickOutside));
</script>

<template>
  <div ref="containerRef" class="relative">
    <!-- 1. 触发按钮 (Size 7 = 1.75rem = 28px) -->
    <button
      type="button"
      @click.stop="toggle"
      class="flex size-full items-center justify-center rounded-md transition-colors"
      title="Switch Language"
    >
      <!-- 图标: Language / Translate (A + 文) -->
      <img src="/lang-switch.png" alt="lang switch" class="size-5" />
    </button>

    <!-- 2. 下拉菜单 -->
    <div
      v-if="isOpen"
      class="absolute right-0 top-full mt-2 w-24 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
    >
      <button
        v-for="lang in availableLocales"
        :key="lang"
        @click="handleSelect(lang)"
        class="block w-full px-4 py-2 text-left text-xs text-gray-700 hover:bg-gray-100 hover:text-blue-600"
        :class="{ 'font-bold text-blue-600 bg-blue-50': locale === lang }"
      >
        {{ lang }}
      </button>
    </div>
  </div>
</template>
