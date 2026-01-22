<template>
  <div
    class="min-h-screen bg-gray-50 text-gray-900 font-sans flex flex-col overflow-hidden"
  >
    <!-- Top App Bar -->
    <header
      class="z-50 bg-white border-b border-gray-200 px-4 py-3 shadow-sm flex-none"
    >
      <div class="w-full flex justify-between items-start">
        <!-- Brand & Info -->
        <div class="flex items-center gap-4 pt-1">
          <div class="flex flex-col">
            <h1
              class="text-xl font-bold tracking-tight text-gray-800 leading-none"
            >
              Context Protector
            </h1>
            <span
              class="text-[10px] font-medium text-gray-400 uppercase tracking-wider mt-1"
            >
              {{ siteName }}
            </span>
          </div>

          <div class="flex items-center gap-2">
            <span
              class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-orange-50 text-orange-600 border border-orange-100"
            >
              <span
                class="w-1.5 h-1.5 bg-orange-500 rounded-full mr-1.5"
              ></span>
              离线
            </span>
            <a
              href="https://github.com/anomalyco/opencode"
              target="_blank"
              class="text-gray-400 hover:text-gray-900 transition-colors"
              title="View on GitHub"
            >
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path
                  d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
                />
              </svg>
            </a>
          </div>
        </div>

        <!-- Rule Config Component -->
        <RuleConfig />
      </div>
    </header>

    <!-- Main Workspace -->
    <main class="flex-1 w-full px-2 py-2 overflow-hidden flex flex-col">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-2 h-full">
        <!-- ================= INPUT COLUMN ================= -->
        <div class="flex flex-col h-full">
          <!-- Input Toolbar (External) -->
          <div class="flex items-center justify-between px-1 mb-2">
            <h2 class="text-sm font-bold text-gray-600 flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-blue-500"></span>
              原始输入
            </h2>
            <div class="flex gap-2">
              <button
                v-if="inputText"
                @click="clearInput"
                class="px-3 py-1 text-xs font-medium text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
              >
                清空
              </button>
              <button
                @click="doReplace"
                :disabled="!inputText.trim()"
                class="flex items-center gap-1.5 px-4 py-1.5 bg-blue-600 text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-sm hover:bg-blue-700 hover:shadow-md active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                title="快捷键: Ctrl+Enter"
              >
                <svg
                  class="w-3.5 h-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2.5"
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
                执行替换
              </button>
            </div>
          </div>

          <!-- Input Area (Card) -->
          <div
            class="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden relative group hover:border-blue-300 transition-colors"
          >
            <textarea
              v-model="inputText"
              ref="inputTextarea"
              class="w-full h-full p-4 bg-transparent border-none resize-none focus:ring-0 text-sm font-mono leading-relaxed text-gray-800 placeholder-gray-400"
              placeholder="在此粘贴代码..."
              @paste="handlePaste"
            ></textarea>
          </div>
        </div>

        <!-- ================= OUTPUT COLUMN ================= -->
        <div class="flex flex-col relative">
          <!-- Output Toolbar (External) -->
          <div class="flex items-center justify-between px-1 mb-2">
            <div class="flex items-center gap-4">
              <h2
                class="text-sm font-bold text-gray-600 flex items-center gap-2"
              >
                <span class="w-2 h-2 rounded-full bg-green-500"></span>
                处理结果
              </h2>
              <!-- Stats Badge -->
              <div
                v-if="replaceCount > 0"
                class="text-xs font-medium px-2 py-0.5 bg-blue-50 text-blue-700 rounded-md border border-blue-100"
              >
                {{ replaceCount }} 处替换
              </div>

              <!-- 【修改点3：复制控件移到此处】 -->
              <div
                class="flex items-center gap-3 ml-2 border-l pl-4 border-gray-300"
              >
                <!-- Auto Copy Checkbox -->
                <label
                  class="flex items-center gap-1.5 cursor-pointer select-none"
                >
                  <input
                    v-model="autoCopy"
                    type="checkbox"
                    class="w-3.5 h-3.5 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
                  />
                  <span class="text-xs text-gray-600 hover:text-gray-900"
                    >自动复制</span
                  >
                </label>

                <!-- Main Copy Button -->
                <button
                  @click="copyToClipboard"
                  :disabled="!outputText"
                  class="flex items-center gap-1.5 px-3 py-1 bg-gray-100 text-gray-700 text-xs font-bold rounded shadow-sm hover:bg-gray-800 hover:text-white active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400"
                  title="Ctrl+C"
                >
                  <svg
                    class="w-3.5 h-3.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                    />
                  </svg>
                  复制
                </button>
              </div>
            </div>

            <!-- 原导航栏位置已移除 -->
          </div>

          <!-- Output Area (Card) -->
          <!-- 添加 relative 用于内部绝对定位浮动按钮 -->
          <div
            class="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden relative hover:border-green-300 transition-colors"
          >
            <!-- 【修改点1：悬浮导航按钮】 -->
            <div
              v-if="replaceCount > 0"
              class="fixed right-6 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-30"
            >
              <button
                @click="searchPrevious"
                class="w-10 h-10 flex items-center justify-center bg-white text-gray-600 rounded-full shadow-lg border border-gray-100 hover:bg-blue-600 hover:text-white hover:scale-110 active:scale-95 transition-all duration-200 group"
                title="上一个 (Ctrl+↑)"
              >
                <svg
                  class="w-6 h-6 transform group-hover:-translate-y-0.5 transition-transform"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2.5"
                    d="M5 15l7-7 7 7"
                  />
                </svg>
              </button>
              <button
                @click="searchNext"
                class="w-10 h-10 flex items-center justify-center bg-white text-gray-600 rounded-full shadow-lg border border-gray-100 hover:bg-blue-600 hover:text-white hover:scale-110 active:scale-95 transition-all duration-200 group"
                title="下一个 (Ctrl+↓)"
              >
                <svg
                  class="w-6 h-6 transform group-hover:translate-y-0.5 transition-transform"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2.5"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
            </div>

            <div
              ref="outputContainer"
              class="w-full h-full p-4 overflow-auto font-mono text-sm whitespace-pre-wrap leading-relaxed selection:bg-green-100 selection:text-green-900 pb-20"
              :class="{
                'text-gray-400 italic flex items-center justify-center':
                  !outputText,
              }"
            >
              <template v-if="outputText">
                <div v-html="outputText"></div>
              </template>
              <template v-else>
                <span>等待输入...</span>
              </template>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick } from "vue";
import { useRulesStore } from "../stores/rules";
import { initDatabase, runMigrations } from "../database/index";
import RuleConfig from "../components/RuleConfig.vue";
import { applyReplace, type ReplaceResult } from "../utils/replace";
import { toast } from "vue-sonner";
import { handleKeyboardShortcuts } from "../utils/shortcuts";
import { sleep } from "radash";

// --- State & Constants ---
const siteName = import.meta.env.VITE_SITE_NAME || "Context Protector";
const rulesStore = useRulesStore();

// UI References
const inputText = ref("");
const outputText = ref("");
const outputContainer = ref<HTMLDivElement>();
const autoCopy = ref(false);

// Logic State
const replaceCount = ref(0);
const currentSearchIndex = ref(-1);
// bounce 状态已废弃，改用直接样式操作
const currentTaskHistory = ref<any[]>([]);
const originalInput = ref("");
const showRestore = ref(false);
const plainOutputText = ref("");

// --- Helper Functions ---

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

const importConfig = (configStr: string) => {
  try {
    const encoded = configStr.replace("context-protector://import/", "");
    const decoded = atob(encoded);
    const config = JSON.parse(decoded);

    if (config.version === 1 && config.rules) {
      config.rules.forEach(async (rule: any) => {
        await rulesStore.addRule({
          note: rule.note,
          matchType: rule.matchType,
          matchValue: rule.matchValue,
          targetValue: rule.targetValue,
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

/**
 * 【修改点2：高亮逻辑完全重写】
 * 立即聚焦当前项，清除其他项样式，不使用延迟移除
 */
const updateMatchHighlighting = (targetIndex: number) => {
  if (!outputContainer.value) return;

  // 获取所有高亮 span
  const highlights = outputContainer.value.querySelectorAll(
    'span[style*="background-color"]',
  );

  if (highlights.length === 0) return;

  highlights.forEach((el, index) => {
    const htmlEl = el as HTMLElement;

    if (index === targetIndex) {
      // === 当前选中项：醒目样式 ===
      htmlEl.style.transition = "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)";
      // 使用红色 outline 替代 border 以免影响布局
      htmlEl.style.outline = "3px solid #ef4444";
      htmlEl.style.outlineOffset = "2px";
      htmlEl.style.borderRadius = "2px";
      htmlEl.style.transform = "scale(1.15)";
      htmlEl.style.zIndex = "20";
      htmlEl.style.position = "relative";
      htmlEl.style.boxShadow = "0 4px 12px rgba(239, 68, 68, 0.4)";

      htmlEl.scrollIntoView({ behavior: "smooth", block: "center" });
    } else {
      // === 其他项：立即复原 ===
      // 仅保留原本的背景色样式（通过 CSS/style 属性），移除额外的强调
      htmlEl.style.outline = "";
      htmlEl.style.outlineOffset = "";
      htmlEl.style.borderRadius = ""; // 复原到 CSS 定义
      htmlEl.style.transform = "";
      htmlEl.style.zIndex = "";
      htmlEl.style.position = "";
      htmlEl.style.boxShadow = "";
    }
  });
};

// --- Core Actions ---

const doReplace = async () => {
  if (!inputText.value.trim()) return;

  const rules = convertRulesForApply(rulesStore.rules);
  const result: ReplaceResult = applyReplace(inputText.value, rules);

  outputText.value = result.result;
  plainOutputText.value = result.result.replace(/<[^>]*>/g, "");
  replaceCount.value = result.history.length;
  currentSearchIndex.value = -1;

  currentTaskHistory.value = result.history;
  originalInput.value = inputText.value;
  showRestore.value = result.history.length > 0;

  // 重置滚动位置
  if (outputContainer.value) outputContainer.value.scrollTop = 0;
  toast.success(`替换完成，共 ${replaceCount.value} 处变更`);

  if (autoCopy.value) {
    await copyToClipboard();
  }
};

const copyToClipboard = async () => {
  if (!outputText.value) return;

  try {
    const plainText = outputText.value
      .replace(/<[^>]*>/g, "")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#039;/g, "'")
      .replace(/&amp;/g, "&");

    await navigator.clipboard.writeText(plainText);
    await sleep(500);
    toast.success("已复制到剪贴板！", { duration: 1500 });
  } catch (error) {
    console.error("Failed to copy:", error);
    toast.error("复制失败，请手动复制");
  }
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

// --- Event Handlers ---

const handlePaste = (event?: ClipboardEvent) => {
  const pastedText = event?.clipboardData?.getData("text") || inputText.value;

  if (pastedText.startsWith("context-protector://")) {
    event?.preventDefault();
    importConfig(pastedText);
    return;
  }

  setTimeout(() => {
    doReplace();
  }, 150);
};

const searchNext = () => {
  if (!outputContainer.value || replaceCount.value === 0) return;

  const highlights = outputContainer.value.querySelectorAll(
    'span[style*="background-color"]',
  );
  if (highlights.length === 0) return;

  currentSearchIndex.value = (currentSearchIndex.value + 1) % highlights.length;
  // 调用新的高亮函数
  updateMatchHighlighting(currentSearchIndex.value);
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

  // 调用新的高亮函数
  updateMatchHighlighting(currentSearchIndex.value);
};

const handleKeydown = (event: KeyboardEvent) => {
  handleKeyboardShortcuts(event, {
    replace: doReplace,
    copy: copyToClipboard,
  });

  if (event.ctrlKey) {
    if (event.key === "ArrowUp") {
      event.preventDefault();
      searchPrevious();
    }
    if (event.key === "ArrowDown") {
      event.preventDefault();
      searchNext();
    }
  }
};

// --- Watchers & Lifecycle ---

watch(inputText, (newVal) => {
  if (originalInput.value && newVal !== originalInput.value) {
    showRestore.value = false;
  }
});

onMounted(async () => {
  try {
    await initDatabase();
    await runMigrations();
    await rulesStore.loadRules();

    if (rulesStore.rules.length === 0) {
      await rulesStore.initializeDefaultRules();
    }

    window.addEventListener("keydown", handleKeydown);
  } catch (error) {
    console.error("Initialization failed:", error);
    toast.error("系统初始化失败，请刷新页面");
  }
});

onUnmounted(() => {
  window.removeEventListener("keydown", handleKeydown);
});
</script>

<style scoped>
textarea::-webkit-scrollbar,
div::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

textarea::-webkit-scrollbar-track,
div::-webkit-scrollbar-track {
  background: transparent;
}

textarea::-webkit-scrollbar-thumb,
div::-webkit-scrollbar-thumb {
  background-color: #d1d5db;
  border-radius: 99px;
}

textarea::-webkit-scrollbar-thumb:hover,
div::-webkit-scrollbar-thumb:hover {
  background-color: #9ca3af;
}

:deep(span[style*="background-color"]) {
  border-radius: 2px;
  cursor: pointer;
  /* 确保有足够的空间不被遮挡 */
  display: inline-block;
}
</style>
