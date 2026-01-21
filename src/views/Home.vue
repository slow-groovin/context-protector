<template>
  <div class="min-h-screen bg-gray-100 py-2">
    <div class="px-2">
      <div class="mb-2">
        <div class="flex justify-between items-center">
          <div class="flex items-center">
            <div class="relative mr-4">
              <div class="text-2xl font-bold text-gray-800">Context Protector</div>
              <div class="absolute bottom-0 right-0 text-xs text-gray-500 -mt-1">{{ siteName }}</div>
            </div>
            <a
              href="https://github.com/anomalyco/opencode"
              target="_blank"
              class="text-gray-600 hover:text-gray-800 mr-4"
              title="GitHub"
            >
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </a>
            <span
              v-if="!isOnline"
              class="text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded"
              title="离线模式"
            >
              离线
            </span>
          </div>
          <!-- Rule Configuration Section -->
          <RuleConfig />
        </div>
      </div>

      <!-- Main Functionality Area -->
      <div class="bg-white rounded-lg shadow p-4 h-[calc(100vh-120px)]">
        <div class="grid grid-cols-2 gap-4 h-full">
          <!-- Left Column: Input -->
          <div class="flex flex-col">
             <div class="flex items-center justify-end mb-4">
               <button
                 v-if="showRestore"
                 @click="doRestore"
                 class="bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 mr-2"
               >
                 Restore
               </button>
               <button
                 @click="clearInput"
                 class="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 mr-2"
               >
                 Clear
               </button>
               <button
                 @click="doReplace"
                 class="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
                 :disabled="!inputText.trim()"
               >
                 Replace
               </button>
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
              class="sticky top-10 flex items-center justify-between mb-1 bg-white/50 border-gray-300 rounded-lg pb-2 pt-1 px-3"
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
                  <input v-model="autoCopy" type="checkbox" class="mr-2" />
                  自动复制
                </label>
              </div>
              <div class="flex items-center">
                <div class="text-sm text-gray-600 mr-4">
                  本次替换了 {{ replaceCount }} 次
                </div>
                 <button
                   @click="searchPrevious"
                   class="px-3 py-1 text-gray-500 hover:text-gray-700 hover:bg-white disabled:opacity-50 rounded border border-gray-300 transition-transform duration-300"
                   :class="{ 'scale-110': bouncePrevious }"
                   :disabled="replaceCount === 0"
                   title="查找上一个替换"
                 >
                   ▲
                 </button>
                 <button
                   @click="searchNext"
                   class="px-3 py-1 text-gray-500 hover:text-gray-700 hover:bg-white disabled:opacity-50 rounded border border-gray-300 ml-1 transition-transform duration-300"
                   :class="{ 'scale-110': bounceNext }"
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
import { ref, onMounted, onUnmounted, computed, watch } from "vue";
import { useRulesStore } from "../stores/rules";
import { initDatabase, runMigrations } from "../database/index";
import RuleConfig from "../components/RuleConfig.vue";
import { applyReplace, type ReplaceResult } from "../utils/replace";
import { toast } from "vue-sonner";
// setInterval(() => {
//   // toast("456");
//   toast.success("复制成功2！");
// }, 500);
const rulesStore = useRulesStore();

const inputText = ref("");
const outputText = ref("");
// const inputTextarea = ref<HTMLTextAreaElement>();
const outputContainer = ref<HTMLDivElement>();
const autoCopy = ref(false);
const replaceCount = ref(0);
const currentSearchIndex = ref(-1);
const bouncePrevious = ref(false);
const bounceNext = ref(false);
const currentTaskHistory = ref<any[]>([]);
const originalInput = ref("");
const showRestore = ref(false);
const plainOutputText = ref("");
const siteName = import.meta.env.VITE_SITE_NAME || 'Context Protector';
const isOnline = computed(() => typeof navigator !== 'undefined' && navigator.onLine);

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

async function doReplace() {
  if (!inputText.value.trim()) return;

  const rules = convertRulesForApply(rulesStore.rules);
  const result: ReplaceResult = applyReplace(inputText.value, rules);

  outputText.value = result.result;
  // Create plain text version for restore
  plainOutputText.value = result.result.replace(/<[^>]*>/g, '');
  replaceCount.value = result.history.length;
  currentSearchIndex.value = -1; // 重置查找索引
  currentTaskHistory.value = result.history;
  originalInput.value = inputText.value;
  showRestore.value = result.history.length > 0;
  console.debug("[replace]", inputText.value, outputText.value);

  if (autoCopy.value) {
    await copyToClipboard();
  }
}

const handlePaste = (event?: ClipboardEvent) => {
  const pastedText = event?.clipboardData?.getData('text') || inputText.value;

  if (pastedText.startsWith('context-protector://')) {
    // Import config instead of replace
    importConfig(pastedText);
    inputText.value = ""; // Clear input since it's a config
    return;
  }

  // Auto trigger replace on paste
  setTimeout(() => {
    doReplace();
  }, 100);
};

const clearInput = () => {
  inputText.value = "";
  outputText.value = "";
  replaceCount.value = 0;
  currentSearchIndex.value = -1;
  showRestore.value = false;
  currentTaskHistory.value = [];
  originalInput.value = "";
  plainOutputText.value = "";
};

const doRestore = () => {
  if (!currentTaskHistory.value.length) return;

  let restoredText = plainOutputText.value;
  // Reverse the replacements: replace replacedWith back to originalMatch
  currentTaskHistory.value.forEach((item: any) => {
    const escapedReplaced = item.replacedWith.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(escapedReplaced, 'g');
    restoredText = restoredText.replace(regex, item.originalMatch);
  });

  // Display on right side (plain text, no highlights)
  outputText.value = restoredText;
  showRestore.value = false; // Hide restore button after restore
};



const importConfig = (configStr: string) => {
  try {
    const encoded = configStr.replace('context-protector://import/', '');
    const decoded = atob(encoded);
    const config = JSON.parse(decoded);

    if (config.version === 1 && config.rules) {
      // Clear existing rules and add new ones
      // Note: This assumes rulesStore has methods to clear and add multiple
      // For now, we'll add them (duplicates possible, but user can manage)
      config.rules.forEach(async (rule: any) => {
        await rulesStore.addRule({
          note: rule.note,
          matchType: rule.matchType,
          matchValue: rule.matchValue,
          targetValue: rule.targetValue
        });
      });
      toast.success("配置已导入！");
    } else {
      toast.error("无效的配置格式");
    }
  } catch (error) {
    console.error("Failed to import config:", error);
    toast.error("导入配置失败");
  }
};

async function copyToClipboard() {
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
    console.debug("复制suc!");
    // 强制在下一个 tick 调用
    toast.success("复制成功！", { duration: 300 });

    console.debug("[toast]复制suc!");
  } catch (error) {
    console.error("Failed to copy to clipboard:", error);
    toast.error("复制失败，请重试");
  }
}

const searchNext = () => {
  if (!outputContainer.value || replaceCount.value === 0) return;

  const highlights = outputContainer.value.querySelectorAll(
    'span[style*="background-color"]',
  );
  if (highlights.length === 0) return;

  currentSearchIndex.value = (currentSearchIndex.value + 1) % highlights.length;
  scrollToHighlight(highlights[currentSearchIndex.value] as HTMLElement);

  // Trigger bounce effect
  bounceNext.value = true;
  setTimeout(() => (bounceNext.value = false), 300);
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

  // Trigger bounce effect
  bouncePrevious.value = true;
  setTimeout(() => (bouncePrevious.value = false), 300);
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

// Keyboard shortcuts
const handleKeydown = (event: KeyboardEvent) => {
  // Ctrl + Arrow Up for previous
  if (event.ctrlKey && event.key === 'ArrowUp') {
    event.preventDefault();
    searchPrevious();
  }
  // Ctrl + Arrow Down for next
  if (event.ctrlKey && event.key === 'ArrowDown') {
    event.preventDefault();
    searchNext();
  }
};

// Watch for input changes to hide restore button
watch(inputText, () => {
  if (originalInput.value && inputText.value !== originalInput.value) {
    showRestore.value = false;
  }
});

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

    // Add keyboard shortcuts
    window.addEventListener('keydown', handleKeydown);
  } catch (error) {
    console.error("Failed to initialize:", error);
  }
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown);
});
</script>
