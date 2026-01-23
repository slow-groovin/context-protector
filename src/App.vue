<script setup lang="ts">
import { Toaster } from "vue-sonner";
import "vue-sonner/style.css";
import { useDark } from "@vueuse/core";

const isDebugMode = import.meta.env.VITE_DEBUG_MODE === "true";
const isDark = useDark();
</script>

<template>
  <div class="min-h-screen bg-background" :class="{ dark: isDark }">
    <Toaster position="top-center" />

    <!-- Debug Navigation (only shown in debug mode) -->
    <nav v-if="isDebugMode" class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center space-x-8">
             <router-link
               to="/"
               class="text-foreground hover:text-foreground-secondary font-medium"
             >
              Home
            </router-link>
            <router-link
              to="/debug"
              class="text-blue-600 hover:text-blue-800 font-medium"
            >
              Debug
            </router-link>
          </div>
          <div class="flex items-center">
            <span
              class="text-xs text-red-600 font-mono bg-red-50 px-2 py-1 rounded"
            >
              DEBUG MODE
            </span>
          </div>
        </div>
      </div>
    </nav>

    <router-view />
  </div>
</template>
