<template>
  <div class="min-h-screen bg-background p-4">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-2xl font-bold text-foreground mb-6">Color Test Page</h1>

      <!-- Dark Mode Toggle -->
      <div class="mb-6">
        <button
          @click="toggleDarkMode"
          class="px-4 py-2 bg-foreground text-background rounded hover:opacity-80 transition-opacity"
        >
          Toggle Dark Mode ({{ isDark ? 'Dark' : 'Light' }})
        </button>
      </div>

      <!-- Color Samples -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <!-- Background Colors -->
        <div class="bg-background p-4 rounded border">
          <h3 class="text-sm font-medium text-foreground mb-2">Background</h3>
          <div class="w-full h-16 bg-background rounded"></div>
        </div>
        <div class="bg-background-secondary p-4 rounded border">
          <h3 class="text-sm font-medium text-foreground mb-2">Background Secondary</h3>
          <div class="w-full h-16 bg-background-secondary rounded"></div>
        </div>
        <div class="bg-background-dark p-4 rounded border">
          <h3 class="text-sm font-medium text-foreground mb-2">Background Dark</h3>
          <div class="w-full h-16 bg-background-dark rounded"></div>
        </div>

        <!-- Foreground Colors -->
        <div class="bg-background p-4 rounded border">
          <h3 class="text-sm font-medium text-foreground mb-2">Foreground</h3>
          <div class="w-full h-16 flex items-center justify-center text-foreground rounded border">Text</div>
        </div>
        <div class="bg-background p-4 rounded border">
          <h3 class="text-sm font-medium text-foreground mb-2">Foreground Secondary</h3>
          <div class="w-full h-16 flex items-center justify-center text-foreground-secondary rounded border">Secondary Text</div>
        </div>
        <div class="bg-background p-4 rounded border">
          <h3 class="text-sm font-medium text-foreground mb-2">Foreground Dark</h3>
          <div class="w-full h-16 flex items-center justify-center text-foreground-dark rounded border">Dark Text</div>
        </div>

        <!-- Border Colors -->
        <div class="bg-background p-4 rounded border border-border">
          <h3 class="text-sm font-medium text-foreground mb-2">Border</h3>
          <div class="w-full h-16 border-2 border-border rounded"></div>
        </div>
        <div class="bg-background p-4 rounded border border-border-dark">
          <h3 class="text-sm font-medium text-foreground mb-2">Border Dark</h3>
          <div class="w-full h-16 border-2 border-border-dark rounded"></div>
        </div>
      </div>

      <!-- Additional Color Tests -->
      <div class="mt-8">
        <h2 class="text-xl font-semibold text-foreground mb-4">Additional Tests</h2>
        <div class="space-y-4">
          <div class="bg-background p-4 rounded border">
            <p class="text-foreground">This is normal text on background.</p>
            <p class="text-foreground-secondary">This is secondary text.</p>
            <button class="px-3 py-1 bg-foreground text-background rounded mt-2">Button</button>
          </div>
          <div class="bg-background-secondary p-4 rounded border">
            <p class="text-foreground">Content on secondary background.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

// 手动控制暗黑模式状态
const isDark = ref(false)

// 切换暗黑模式
const toggleDarkMode = () => {
  isDark.value = !isDark.value
  document.documentElement.classList.toggle('dark', isDark.value)
}

// 初始化时检查当前模式（可选，从浏览器设置）
onMounted(() => {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  isDark.value = prefersDark
  document.documentElement.classList.toggle('dark', isDark.value)
})
</script>