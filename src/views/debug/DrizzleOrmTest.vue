<template>
    <div class="min-h-screen bg-gray-100 py-8">
        <div class="max-w-4xl mx-auto px-4">
            <h1 class="text-3xl font-bold text-gray-800 mb-8">
                Drizzle ORM Test
            </h1>

            <div class="space-y-6">
                <!-- Navigation -->
                <div class="bg-white rounded-lg shadow p-6">
                    <router-link
                        to="/debug"
                        class="text-blue-600 hover:text-blue-800"
                    >
                        ← Back to Debug Menu
                    </router-link>
                </div>

                <!-- Drizzle ORM Tests -->
                <div class="bg-white rounded-lg shadow p-6">
                    <h2 class="text-xl font-semibold mb-4">
                        Drizzle ORM Tests (Schema-Driven)
                    </h2>
                    <div class="space-y-4">
                        <div class="flex gap-4 flex-wrap">
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
                                @click="testRelations"
                                :disabled="loading"
                                class="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600 disabled:bg-gray-400"
                            >
                                Test Relations & Joins
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
                                    message.type === 'success'
                                        ? 'bg-green-100 text-green-800'
                                        : message.type === 'error'
                                          ? 'bg-red-100 text-red-800'
                                          : 'bg-blue-100 text-blue-800',
                                ]"
                            >
                                <span class="font-medium"
                                    >{{ message.type.toUpperCase() }}:</span
                                >
                                {{ message.text }}
                            </div>
                        </div>

                        <!-- Test Data -->
                        <div v-if="testData.length > 0" class="mt-4">
                            <h3 class="font-semibold mb-2">Test Data:</h3>
                            <pre
                                class="bg-gray-100 p-3 rounded overflow-auto"
                                >{{ JSON.stringify(testData, null, 2) }}</pre
                            >
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import {
    initDatabase,
    runMigrations,
    resetDatabase,
    getDatabase,
} from "../../database";
import { debugUsers, debugTasks, debugContexts } from "../../database/schema";
import { eq, desc } from "drizzle-orm";

const loading = ref(false);
const messages = ref<{ type: "success" | "error" | "info"; text: string }[]>(
    [],
);
const testData = ref<any[]>([]);

const addMessage = (type: "success" | "error" | "info", text: string) => {
    messages.value.unshift({ type, text });
    if (messages.value.length > 10) {
        messages.value.pop();
    }
};

const initDB = async () => {
    loading.value = true;
    try {
        await initDatabase();
        addMessage(
            "success",
            "Database initialized successfully with Drizzle ORM",
        );
    } catch (error: any) {
        addMessage("error", `Database initialization failed: ${error.message}`);
    } finally {
        loading.value = false;
    }
};

const runDBMigrations = async () => {
    loading.value = true;
    try {
        await runMigrations();
        addMessage(
            "success",
            "Database migrations completed successfully with Drizzle schema",
        );
    } catch (error: any) {
        addMessage("error", `Migration failed: ${error.message}`);
    } finally {
        loading.value = false;
    }
};

const testCRUD = async () => {
    loading.value = true;
    try {
        const db = await getDatabase();
        if (!db) throw new Error("Database not initialized");

        // Create a test user
        const newUser = await db
            .insert(debugUsers)
            .values({
                name: "Drizzle User",
                email: `drizzle-${Date.now()}@example.com`,
                createdAt: new Date().toISOString(),
            })
            .returning();

        addMessage("success", `Created user with Drizzle: ${newUser[0]?.name}`);

        // Create multiple tasks for the user
        const newTasks = await db
            .insert(debugTasks)
            .values([
                {
                    title: "Learn Drizzle ORM",
                    description: "Master Drizzle ORM features",
                    completed: 1,
                    userId: newUser[0]?.id || 1,
                    createdAt: new Date().toISOString(),
                },
                {
                    title: "Build with Relations",
                    description: "Use Drizzle relations for complex queries",
                    completed: 0,
                    userId: newUser[0]?.id || 1,
                    createdAt: new Date().toISOString(),
                },
            ])
            .returning();

        addMessage("success", `Created ${newTasks.length} tasks with Drizzle`);

        // Create a test context
        const newContext = await db
            .insert(debugContexts)
            .values({
                name: "Drizzle Context",
                description: "Context for Drizzle ORM testing",
                content:
                    "This is a test context content for demonstrating Drizzle ORM capabilities",
                createdAt: new Date().toISOString(),
            })
            .returning();

        addMessage(
            "success",
            `Created context with Drizzle: ${newContext[0]?.name}`,
        );

        // Query with filters
        const allUsers = await db
            .select()
            .from(debugUsers)
            .where(eq(debugUsers.name, "Drizzle User"));
        const allTasks = await db
            .select()
            .from(debugTasks)
            .orderBy(desc(debugTasks.createdAt));
        const allContexts = await db.select().from(debugContexts);

        testData.value = [
            { type: "filtered_users", data: allUsers },
            { type: "ordered_tasks", data: allTasks },
            { type: "contexts", data: allContexts },
        ];

        addMessage(
            "success",
            "CRUD operations completed successfully with Drizzle ORM",
        );
    } catch (error: any) {
        addMessage("error", `CRUD test failed: ${error.message}`);
    } finally {
        loading.value = false;
    }
};

const testRelations = async () => {
    loading.value = true;
    try {
        const db = await getDatabase();
        if (!db) throw new Error("Database not initialized");

        // Test relations with joins
        const usersWithTasks = await db.query.debugUsers.findMany({
            with: {
                tasks: true,
            },
        });

        addMessage(
            "success",
            `Queried ${usersWithTasks.length} users with their tasks using relations`,
        );

        // Test reverse relation
        const tasksWithUsers = await db.query.debugTasks.findMany({
            with: {
                user: true,
            },
        });

        addMessage(
            "success",
            `Queried ${tasksWithUsers.length} tasks with their users using relations`,
        );

        // Test complex query with join
        const completedTasks = await db
            .select()
            .from(debugTasks)
            .innerJoin(debugUsers, eq(debugTasks.userId, debugUsers.id))
            .where(eq(debugTasks.completed, 1));

        addMessage(
            "success",
            `Found ${completedTasks.length} completed tasks with user info`,
        );

        testData.value = [
            { type: "users_with_tasks", data: usersWithTasks },
            { type: "tasks_with_users", data: tasksWithUsers },
            { type: "completed_tasks_joined", data: completedTasks },
        ];

        addMessage(
            "success",
            "Relations and joins tested successfully with Drizzle ORM",
        );
    } catch (error: any) {
        addMessage("error", `Relations test failed: ${error.message}`);
    } finally {
        loading.value = false;
    }
};

const resetDB = async () => {
    loading.value = true;
    try {
        await resetDatabase();
        testData.value = [];
        addMessage("success", "Database reset completed");
    } catch (error: any) {
        addMessage("error", `Database reset failed: ${error.message}`);
    } finally {
        loading.value = false;
    }
};

onMounted(() => {
    addMessage(
        "info",
        `Debug Mode: ${import.meta.env.VITE_DEBUG_MODE === "true" ? "Enabled" : "Disabled"}`,
    );
    addMessage(
        "info",
        "This page demonstrates full Drizzle ORM capabilities including relations and schema-driven operations",
    );
});
</script>
