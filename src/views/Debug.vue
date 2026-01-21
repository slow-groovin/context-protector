<template>
  <div class="min-h-screen bg-gray-100 py-8">
    <div class="max-w-4xl mx-auto px-4">
      <h1 class="text-3xl font-bold text-gray-800 mb-8">Debug Page</h1>

      <div class="space-y-6">
        <!-- Navigation -->
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-xl font-semibold mb-4">Navigation</h2>
          <router-link to="/" class="text-blue-600 hover:text-blue-800">
            Home
          </router-link>
        </div>

        <!-- Debug Test Links -->
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-xl font-semibold mb-4">Debug Tests</h2>
          <div class="space-y-2">
            <router-link
              to="/debug/database"
              class="block text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-3 py-2 rounded"
            >
              Database Tests (SQLocal + Drizzle + OPFS)
            </router-link>
            <router-link
              to="/debug/drizzle-orm"
              class="block text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-3 py-2 rounded"
            >
              Drizzle ORM Tests (Schema-Driven with Relations)
            </router-link>
            <router-link
              to="/debug/environment"
              class="block text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-3 py-2 rounded"
            >
              Environment Info
            </router-link>
             <router-link
               to="/debug/opfs-viewer"
               class="block text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-3 py-2 rounded"
             >
               OPFS Viewer (Origin Private File System)
             </router-link>
<router-link
                to="/debug/replace"
                class="block text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-3 py-2 rounded"
              >
                Replace Tool
              </router-link>
              <router-link
                to="/debug/toast"
                class="block text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-3 py-2 rounded"
              >
                Vue-Sonner Toast Debug
              </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'

onMounted(() => {
  console.log('Debug Mode:', import.meta.env.VITE_DEBUG_MODE === 'true' ? 'Enabled' : 'Disabled')
})
</script>