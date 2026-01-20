<template>
  <div class="min-h-screen bg-gray-100 py-8">
    <div class="max-w-4xl mx-auto px-4">
      <h1 class="text-3xl font-bold text-gray-800 mb-8">Environment Info</h1>

      <div class="space-y-6">
        <!-- Navigation -->
        <div class="bg-white rounded-lg shadow p-6">
          <router-link to="/debug" class="text-blue-600 hover:text-blue-800">
            ← Back to Debug Menu
          </router-link>
        </div>

        <!-- Environment Info -->
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-xl font-semibold mb-4">Environment Info</h2>
          <div class="space-y-2">
            <p><strong>User Agent:</strong> {{ userAgent }}</p>
            <p><strong>OPFS Support:</strong> {{ supportsOPFS ? 'Yes' : 'No' }}</p>
            <p><strong>Database Status:</strong> {{ dbStatus }}</p>
            <p><strong>Debug Mode:</strong> {{ debugMode }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const supportsOPFS = ref(false)
const dbStatus = ref('Not initialized')
const userAgent = ref('')
const debugMode = ref('Disabled')

onMounted(() => {
  // Check OPFS support
  if (typeof window !== 'undefined' && window.navigator) {
    supportsOPFS.value = 'storage' in window.navigator && 'getDirectory' in (window.navigator.storage as any)
    userAgent.value = window.navigator.userAgent
  }
  debugMode.value = import.meta.env.VITE_DEBUG_MODE === 'true' ? 'Enabled' : 'Disabled'
})
</script>