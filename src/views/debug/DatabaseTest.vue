<template>
  <div class="min-h-screen bg-gray-100 py-8">
    <div class="max-w-4xl mx-auto px-4">
      <h1 class="text-3xl font-bold text-gray-800 mb-8">Database Tests</h1>

      <div class="space-y-6">
        <!-- Navigation -->
        <div class="bg-white rounded-lg shadow p-6">
          <router-link to="/debug" class="text-blue-600 hover:text-blue-800">
            ← Back to Debug Menu
          </router-link>
        </div>

        <!-- Database Tests -->
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-xl font-semibold mb-4">Database Tests (SQLocal + Drizzle + OPFS)</h2>
          <div class="space-y-4">
            <div class="flex gap-4">
              <button
                @click="initDB"
                :disabled="loading"
                class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
              >
                Initialize Database
              </button>
              <button
                @click="runDBMigrations"
                :disabled="loading"
                class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:bg-gray-400"
              >
                Run Migrations
              </button>
              <button
                @click="testCRUD"
                :disabled="loading"
                class="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 disabled:bg-gray-400"
              >
                Test CRUD Operations
              </button>
              <button
                @click="resetDB"
                :disabled="loading"
                class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 disabled:bg-gray-400"
              >
                Reset Database
              </button>
            </div>

            <!-- Status Messages -->
            <div v-if="messages.length > 0" class="space-y-2">
              <div
                v-for="(message, index) in messages"
                :key="index"
                :class="[
                  'p-3 rounded',
                  message.type === 'success' ? 'bg-green-100 text-green-800' :
                  message.type === 'error' ? 'bg-red-100 text-red-800' :
                  'bg-blue-100 text-blue-800'
                ]"
              >
                <span class="font-medium">{{ message.type.toUpperCase() }}:</span> {{ message.text }}
              </div>
            </div>

            <!-- Test Data -->
            <div v-if="testData.length > 0" class="mt-4">
              <h3 class="font-semibold mb-2">Test Data:</h3>
              <pre class="bg-gray-100 p-3 rounded overflow-auto">{{ JSON.stringify(testData, null, 2) }}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { initDatabase, runMigrations, resetDatabase, getDatabase } from '../../database'
import { users, tasks, contexts } from '../../database/schema'

const loading = ref(false)
const messages = ref<{ type: 'success' | 'error' | 'info', text: string }[]>([])
const testData = ref<any[]>([])

const addMessage = (type: 'success' | 'error' | 'info', text: string) => {
  messages.value.unshift({ type, text })
  if (messages.value.length > 10) {
    messages.value.pop()
  }
}

const initDB = async () => {
  loading.value = true
  try {
    await initDatabase()
    addMessage('success', 'Database initialized successfully with OPFS support')
  } catch (error: any) {
    addMessage('error', `Database initialization failed: ${error.message}`)
  } finally {
    loading.value = false
  }
}

const runDBMigrations = async () => {
  loading.value = true
  try {
    await runMigrations()
    addMessage('success', 'Database migrations completed successfully')
  } catch (error: any) {
    addMessage('error', `Migration failed: ${error.message}`)
  } finally {
    loading.value = false
  }
}

const testCRUD = async () => {
  loading.value = true
  try {
    const db = await getDatabase()
    if (!db) throw new Error('Database not initialized')

    // Create a test user
    const newUser = await db.insert(users).values({
      name: 'Test User',
      email: `test-${Date.now()}@example.com`,
      createdAt: new Date().toISOString()
    }).returning()

    addMessage('success', `Created user: ${newUser[0]?.name}`)

    // Create a test task
    const newTask = await db.insert(tasks).values({
      title: 'Test Task',
      description: 'This is a test task',
      completed: 0,
      userId: newUser[0]?.id || 1,
      createdAt: new Date().toISOString()
    }).returning()

    addMessage('success', `Created task: ${newTask[0]?.title}`)

    // Create a test context
    const newContext = await db.insert(contexts).values({
      name: 'Test Context',
      description: 'This is a test context',
      content: 'Sample context content for testing',
      createdAt: new Date().toISOString()
    }).returning()

    addMessage('success', `Created context: ${newContext[0]?.name}`)

    // Query all data
    const allUsers = await db.select().from(users)
    const allTasks = await db.select().from(tasks)
    const allContexts = await db.select().from(contexts)

    testData.value = [
      { type: 'users', data: allUsers },
      { type: 'tasks', data: allTasks },
      { type: 'contexts', data: allContexts }
    ]

    addMessage('success', 'CRUD operations completed successfully')
  } catch (error: any) {
    addMessage('error', `CRUD test failed: ${error.message}`)
  } finally {
    loading.value = false
  }
}

const resetDB = async () => {
  loading.value = true
  try {
    await resetDatabase()
    testData.value = []
    addMessage('success', 'Database reset completed')
  } catch (error: any) {
    addMessage('error', `Database reset failed: ${error.message}`)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  addMessage('info', `Debug Mode: ${import.meta.env.VITE_DEBUG_MODE === 'true' ? 'Enabled' : 'Disabled'}`)
})
</script>