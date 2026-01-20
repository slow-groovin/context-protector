<template>
  <div class="min-h-screen bg-gray-100 py-8">
    <div class="max-w-6xl mx-auto px-4">
      <h1 class="text-3xl font-bold text-gray-800 mb-8">OPFS Viewer</h1>

      <div class="space-y-6">
        <!-- Back to Debug -->
        <div class="bg-white rounded-lg shadow p-6">
          <router-link to="/debug" class="text-blue-600 hover:text-blue-800">
            ← Back to Debug Page
          </router-link>
        </div>

        <!-- Controls -->
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-xl font-semibold mb-4">Controls</h2>
          <div class="space-y-2">
            <button @click="loadOpfsContents" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Load OPFS Contents
            </button>
            <button @click="clearLogs" class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded ml-2">
              Clear Logs
            </button>
          </div>
        </div>

        <!-- File List -->
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-xl font-semibold mb-4">OPFS Files</h2>
          <div v-if="files.length === 0" class="text-gray-500">
            No files found or not loaded yet.
          </div>
          <div v-else class="space-y-2">
            <div v-for="file in files" :key="file.name" class="border border-gray-200 rounded p-4">
              <div class="flex justify-between items-center">
                <div>
                  <h3 class="font-medium">{{ file.name }}</h3>
                  <p class="text-sm text-gray-600">Size: {{ file.size }} bytes</p>
                  <p class="text-sm text-gray-600">Last Modified: {{ new Date(file.lastModified).toLocaleString() }}</p>
                </div>
                <div class="space-x-2">
                  <button @click="viewFile(file)" class="bg-green-500 hover:bg-green-700 text-white text-sm py-1 px-3 rounded">
                    View Content
                  </button>
                  <button @click="downloadFile(file)" class="bg-purple-500 hover:bg-purple-700 text-white text-sm py-1 px-3 rounded">
                    Download
                  </button>
                </div>
              </div>
              <div v-if="file.content" class="mt-4">
                <h4 class="font-medium mb-2">Content:</h4>
                <pre class="bg-gray-50 p-3 rounded text-sm overflow-x-auto">{{ file.content }}</pre>
              </div>
            </div>
          </div>
        </div>

        <!-- Logs -->
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-xl font-semibold mb-4">Logs</h2>
          <div id="logs" class="bg-black text-green-400 p-4 rounded font-mono text-sm max-h-60 overflow-y-auto">
            <p>OPFS Viewer Loaded</p>
            <p v-for="log in logs" :key="log.id">{{ log.timestamp }}: {{ log.message }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface OpfsFile {
  name: string
  size: number
  lastModified: number
  content?: string
}

const files = ref<OpfsFile[]>([])
const logs = ref<Array<{ id: number, timestamp: string, message: string }>>([])
let logId = 0

const addLog = (message: string) => {
  logs.value.push({
    id: ++logId,
    timestamp: new Date().toLocaleTimeString(),
    message
  })
  // Keep only last 20 logs
  if (logs.value.length > 20) {
    logs.value.shift()
  }
}

const clearLogs = () => {
  logs.value = []
  logId = 0
}

const loadOpfsContents = async () => {
  try {
    addLog('Loading OPFS contents...')
    const root = await navigator.storage.getDirectory()
    const fileList: OpfsFile[] = []

    // Use entries() with proper typing
    for await (const [name, handle] of (root as any).entries()) {
      if (handle.kind === 'file') {
        const file = await handle.getFile()
        fileList.push({
          name,
          size: file.size,
          lastModified: file.lastModified
        })
      }
    }

    files.value = fileList
    addLog(`Found ${fileList.length} files`)
  } catch (error) {
    addLog(`Error loading OPFS: ${error}`)
    console.error('OPFS error:', error)
  }
}

const viewFile = async (file: OpfsFile) => {
  try {
    addLog(`Viewing file: ${file.name}`)
    const root = await navigator.storage.getDirectory()
    const fileHandle = await root.getFileHandle(file.name)
    const fileData = await fileHandle.getFile()
    const content = await fileData.text()
    
    file.content = content
    addLog(`Loaded content for ${file.name}`)
  } catch (error) {
    addLog(`Error viewing file ${file.name}: ${error}`)
    console.error('View file error:', error)
  }
}

const downloadFile = async (file: OpfsFile) => {
  try {
    addLog(`Downloading file: ${file.name}`)
    const root = await navigator.storage.getDirectory()
    const fileHandle = await root.getFileHandle(file.name)
    const fileData = await fileHandle.getFile()
    const content = await fileData.arrayBuffer()
    
    const blob = new Blob([content])
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = file.name
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    addLog(`Downloaded ${file.name}`)
  } catch (error) {
    addLog(`Error downloading file ${file.name}: ${error}`)
    console.error('Download file error:', error)
  }
}

onMounted(() => {
  addLog('OPFS Viewer component mounted')
  // Auto-load on mount
  loadOpfsContents()
})
</script>