<template>
    <div class="min-h-screen bg-gray-100 py-2">
        <div class="px-2">
            <div class="flex justify-between items-center mb-2">
                <h1 class="text-2xl font-bold text-gray-800">
                    Context Protector
                </h1>
                <!-- Rule Configuration Section -->
                <RuleConfig />
            </div>

            <!-- Main Functionality Area -->
            <div class="bg-white rounded-lg shadow p-4 h-[calc(100vh-120px)]">
                <div class="grid grid-cols-2 gap-4 h-full">
                    <!-- Left Column: Input -->
                    <div class="flex flex-col">
                        <div class="flex items-center mb-4">
                            <button
                                @click="doReplace"
                                class="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 mr-4"
                                :disabled="!inputText.trim()"
                            >
                                Replace
                            </button>
                            <!-- Space for future buttons -->
                            <div class="flex-1"></div>
                        </div>
                        <textarea
                            v-model="inputText"
                            ref="inputTextarea"
                            class="flex-1 p-4 border border-gray-300 rounded-lg resize-none"
                            placeholder="粘贴内容到这里..."
                            @paste="handlePaste"
                        ></textarea>
                    </div>

                    <!-- Right Column: Output -->
                    <div class="flex flex-col">
                        <!-- Control Panel -->
                        <div
                            class="flex items-center justify-between mb-4 bg-gray-50 rounded-lg"
                        >
                            <div class="flex items-center">
                                <button
                                    @click="copyToClipboard"
                                    class="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 mr-4"
                                    :disabled="!outputText"
                                >
                                    复制
                                </button>
                                <label class="flex items-center">
                                    <input
                                        v-model="autoCopy"
                                        type="checkbox"
                                        class="mr-2"
                                    />
                                    自动复制
                                </label>
                            </div>
                            <div class="flex items-center">
                                <div class="text-sm text-gray-600 mr-4">
                                    本次替换了 {{ replaceCount }} 次
                                </div>
                                <button
                                    @click="searchPrevious"
                                    class="px-3 py-1 text-gray-500 hover:text-gray-700 hover:bg-white disabled:opacity-50 rounded border border-gray-300"
                                    :disabled="replaceCount === 0"
                                    title="查找上一个替换"
                                >
                                    ▲
                                </button>
                                <button
                                    @click="searchNext"
                                    class="px-3 py-1 text-gray-500 hover:text-gray-700 hover:bg-white disabled:opacity-50 rounded border border-gray-300 ml-1"
                                    :disabled="replaceCount === 0"
                                    title="查找下一个替换"
                                >
                                    ▼
                                </button>
                            </div>
                        </div>

                        <!-- Output Container -->
                        <div
                            ref="outputContainer"
                            class="flex-1 p-4 border border-gray-300 rounded-lg overflow-auto whitespace-pre-wrap"
                            v-html="outputText"
                        ></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRulesStore } from "../stores/rules";
import { initDatabase, runMigrations } from "../database/index";
import RuleConfig from "../components/RuleConfig.vue";
import { applyReplace, type ReplaceResult } from "../utils/replace";

const rulesStore = useRulesStore();

const inputText = ref("");
const outputText = ref("");
// const inputTextarea = ref<HTMLTextAreaElement>();
const outputContainer = ref<HTMLDivElement>();
const autoCopy = ref(false);
const replaceCount = ref(0);
const currentSearchIndex = ref(-1);

// Convert new rule format to old format for applyReplace function
const convertRulesForApply = (rules: any[]) => {
    return rules.map((rule) => ({
        id: rule.id,
        match: {
            type: rule.matchType,
            value: rule.matchValue,
        },
        target: {
            type: "fixed" as const,
            value: rule.targetValue,
        },
    }));
};

const doReplace = async () => {
    if (!inputText.value.trim()) return;

    const rules = convertRulesForApply(rulesStore.rules);
    const result: ReplaceResult = applyReplace(inputText.value, rules);
    outputText.value = result.result;
    replaceCount.value = result.history.length;
    currentSearchIndex.value = -1; // 重置查找索引

    if (autoCopy.value) {
        await copyToClipboard();
    }
};

const handlePaste = () => {
    // Auto trigger replace on paste
    setTimeout(() => {
        doReplace();
    }, 100);
};

const copyToClipboard = async () => {
    if (!outputText.value) return;

    try {
        // Remove HTML tags and decode entities for clipboard
        const plainText = outputText.value
            .replace(/<[^>]*>/g, "") // Remove HTML tags
            .replace(/&lt;/g, "<")
            .replace(/&gt;/g, ">")
            .replace(/&quot;/g, '"')
            .replace(/&#039;/g, "'")
            .replace(/&amp;/g, "&");

        await navigator.clipboard.writeText(plainText);
        // Could add a toast notification here
    } catch (error) {
        console.error("Failed to copy to clipboard:", error);
    }
};

const searchNext = () => {
    if (!outputContainer.value || replaceCount.value === 0) return;

    const highlights = outputContainer.value.querySelectorAll(
        'span[style*="background-color"]',
    );
    if (highlights.length === 0) return;

    currentSearchIndex.value =
        (currentSearchIndex.value + 1) % highlights.length;
    scrollToHighlight(highlights[currentSearchIndex.value] as HTMLElement);
};

const searchPrevious = () => {
    if (!outputContainer.value || replaceCount.value === 0) return;

    const highlights = outputContainer.value.querySelectorAll(
        'span[style*="background-color"]',
    );
    if (highlights.length === 0) return;

    currentSearchIndex.value =
        currentSearchIndex.value <= 0
            ? highlights.length - 1
            : currentSearchIndex.value - 1;
    scrollToHighlight(highlights[currentSearchIndex.value] as HTMLElement);
};

const scrollToHighlight = (element: HTMLElement) => {
    if (!outputContainer.value) return;

    // 临时添加高亮样式
    const originalStyle = element.style.cssText;
    element.style.outline = "2px solid #2563eb";
    element.style.outlineOffset = "2px";

    // 滚动到元素
    element.scrollIntoView({ behavior: "smooth", block: "center" });

    // 移除临时高亮
    setTimeout(() => {
        element.style.cssText = originalStyle;
    }, 2000);
};

// Initialize database and load rules
onMounted(async () => {
    try {
        await initDatabase();
        await runMigrations();

        await rulesStore.loadRules();

        // Initialize default rules if none exist
        if (rulesStore.rules.length === 0) {
            await rulesStore.initializeDefaultRules();
        }
    } catch (error) {
        console.error("Failed to initialize:", error);
    }
});
</script>
