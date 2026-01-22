<template>
  <details
    class="bg-white rounded-lg p-2 mb-2 group border border-gray-200"
    :open="isOpen"
    @toggle="
      (event) => {
        isOpen = (event?.target as any).open;
      }
    "
  >
    <!-- Header: Title & Actions -->
    <summary
      class="list-none flex items-center justify-between cursor-pointer select-none p-1"
    >
      <!-- Left: Arrow + Title -->
      <div class="flex items-center gap-2 text-lg font-semibold text-gray-800">
        <!-- Custom Triangle Arrow to ensure flex layout works perfectly -->
        <svg
          class="w-3 h-3 text-gray-500 transition-transform duration-200 transform group-open:rotate-90"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M8 5v14l11-7z" />
        </svg>
        规则配置
      </div>

      <!-- Right: Clipboard Actions (Prevent detail toggle with @click.stop) -->
      <div class="flex gap-2" @click.stop v-if="isOpen">
        <button
          @click="importConfig"
          class="flex items-center gap-1 px-2 py-1 text-xs bg-gray-50 border border-gray-300 rounded text-gray-600 hover:text-blue-600 hover:border-blue-400 hover:bg-white transition"
          title="读取剪切板内容并导入"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-3.5 w-3.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
          导入
        </button>
        <button
          @click="exportConfig"
          class="flex items-center gap-1 px-2 py-1 text-xs bg-gray-50 border border-gray-300 rounded text-gray-600 hover:text-blue-600 hover:border-blue-400 hover:bg-white transition"
          title="导出配置到剪切板"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-3.5 w-3.5"
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
          导出
        </button>
      </div>
    </summary>

    <div class="mt-3 space-y-2 pl-2">
      <!-- 1. Add New Rule (Strict Single Row) -->
      <div class="border border-green-200 rounded p-1 bg-green-50/30">
        <form @submit.prevent="handleAddRule" class="flex items-center gap-1">
          <!-- Type Select -->
          <select
            v-model="newRule.matchType"
            class="w-16 p-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-green-500 bg-white"
            title="匹配类型"
          >
            <option value="fixed">文本</option>
            <option value="regex">正则</option>
          </select>

          <!-- Match Value (Textarea for resizing) -->
          <div class="flex-1 relative">
            <textarea
              v-model="newRule.matchValue"
              rows="1"
              required
              class="w-full p-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-green-500 min-h-[30px] resize-y align-middle leading-5"
              placeholder="匹配值"
            ></textarea>
          </div>

          <!-- Arrow Icon -->
          <div class="text-gray-400 shrink-0">
            <svg
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              ></path>
            </svg>
          </div>

          <!-- Target Value -->
          <div class="flex-1 relative">
            <textarea
              v-model="newRule.targetValue"
              rows="1"
              class="w-full p-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-green-500 min-h-[30px] resize-y align-middle leading-5"
              placeholder="替换为"
            ></textarea>
          </div>

          <!-- Note -->
          <input
            v-model="newRule.note"
            type="text"
            class="flex-1 min-w-[7ch] p-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-green-500"
            placeholder="备注"
          />

          <!-- Add Button -->
          <button
            type="submit"
            :disabled="isAdding"
            class="p-1.5 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 shrink-0"
            title="添加规则"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                clip-rule="evenodd"
              />
            </svg>
          </button>
        </form>
      </div>

      <!-- 2. Rules List (Strict Single Row) -->
      <div class="space-y-1">
        <div
          v-if="rulesStore.rules.length === 0"
          class="text-center text-gray-400 text-sm py-2"
        >
          暂无规则，请在上方添加
        </div>

        <div
          v-for="rule in rulesStore.rules as EditableReplaceRule[]"
          :key="rule.id"
          class="group/item bg-white border border-gray-200 rounded hover:border-blue-300 transition-colors"
        >
          <!-- View Mode (Single Row) -->
          <div
            v-if="!rule.isEditing"
            class="flex items-center gap-2 p-1.5 pl-2"
          >
            <!-- Type Badge -->
            <span
              :class="[
                'shrink-0 px-1 rounded text-[10px] font-mono border',
                rule.matchType === 'regex'
                  ? 'bg-purple-50 text-purple-700 border-purple-100'
                  : 'bg-gray-50 text-gray-600 border-gray-200',
              ]"
            >
              {{ rule.matchType === "regex" ? "Reg" : "Txt" }}
            </span>

            <!-- Match Content (Truncated) -->
            <div class="flex-1 min-w-0" :title="rule.matchValue">
              <div
                class="truncate text-sm font-mono text-red-800 bg-red-50/50 rounded px-1"
              >
                {{ rule.matchValue }}
              </div>
            </div>

            <!-- Arrow -->
            <span class="text-gray-300 shrink-0">→</span>

            <!-- Target Content (Truncated) -->
            <div class="flex-1 min-w-0" :title="rule.targetValue">
              <div
                class="truncate text-sm font-mono text-green-800 bg-green-50/50 rounded px-1"
              >
                {{ rule.targetValue || "(空)" }}
              </div>
            </div>

            <!-- Note (Visible if short, truncated if long) -->
            <div
              class="w-20 text-xs text-gray-400 truncate text-right shrink-0"
              :title="rule.note"
            >
              {{ rule.note }}
            </div>

            <!-- Actions (Show on hover or always visible but subtle) -->
            <div
              class="flex gap-1 shrink-0 opacity-0 group-hover/item:opacity-100 transition-opacity"
            >
              <button
                @click="startEdit(rule)"
                class="text-blue-500 hover:text-blue-700 p-0.5"
                title="编辑"
              >
                <svg
                  class="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                  ></path>
                </svg>
              </button>
              <button
                @click="handleDeleteRule(rule.id)"
                class="text-red-500 hover:text-red-700 p-0.5"
                title="删除"
              >
                <svg
                  class="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  ></path>
                </svg>
              </button>
            </div>
          </div>

          <!-- Edit Mode -->
          <form
            v-else
            @submit.prevent="handleUpdateRule(rule)"
            class="flex items-center gap-1 p-1 bg-blue-50 rounded"
          >
            <select
              v-model="rule.editMatchType"
              class="w-14 p-1 text-xs border border-blue-200 rounded bg-white"
            >
              <option value="fixed">Txt</option>
              <option value="regex">Reg</option>
            </select>
            <textarea
              v-model="rule.editMatchValue"
              rows="1"
              class="flex-1 min-w-0 p-1 text-sm border border-blue-200 rounded min-h-[28px] resize-y align-middle"
              placeholder="匹配"
            />
            <span class="text-blue-300">➜</span>
            <textarea
              v-model="rule.editTargetValue"
              rows="1"
              class="flex-1 min-w-0 p-1 text-sm border border-blue-200 rounded min-h-[28px] resize-y align-middle"
              placeholder="替换"
            />
            <input
              v-model="rule.editNote"
              class="flex-1 min-w-[7ch] p-1 text-xs border border-blue-200 rounded"
              placeholder="备注"
            />
            <button
              type="submit"
              class="text-green-600 hover:bg-green-100 rounded p-1"
              title="保存"
            >
              <svg
                class="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
            </button>
            <button
              type="button"
              @click="cancelEdit(rule)"
              class="text-gray-500 hover:bg-gray-200 rounded p-1"
              title="取消"
            >
              <svg
                class="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </button>
          </form>
        </div>
      </div>
    </div>
  </details>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { useRulesStore, type ReplaceRule } from "../stores/rules";
import { toast } from "vue-sonner";
interface EditableReplaceRule extends ReplaceRule {
  isEditing?: boolean;
  editNote?: string;
  editMatchType?: "fixed" | "regex";
  editMatchValue?: string;
  editTargetValue?: string;
  isUpdating?: boolean;
}

const isOpen = ref(false);
const rulesStore = useRulesStore();
const isAdding = ref(false);

const newRule = reactive({
  note: "",
  matchType: "fixed" as "fixed" | "regex",
  matchValue: "",
  targetValue: "",
});

onMounted(() => {
  const stored = localStorage.getItem("ruleConfigFirstUse");
  if (stored === null) {
    isOpen.value = true;
    localStorage.setItem("ruleConfigFirstUse", "used");
    // @ts-ignore
    toast("请先配置规则吧");
  }
});

const handleAddRule = async () => {
  if (!newRule.matchValue.trim()) return;

  isAdding.value = true;
  try {
    await rulesStore.addRule({
      note: newRule.note || undefined,
      matchType: newRule.matchType,
      matchValue: newRule.matchValue,
      targetValue: newRule.targetValue,
    });
    // Reset inputs
    newRule.note = "";
    newRule.matchValue = "";
    newRule.targetValue = "";
  } catch (error) {
    console.error("Failed to add rule:", error);
  } finally {
    isAdding.value = false;
  }
};

const startEdit = (rule: EditableReplaceRule) => {
  rule.isEditing = true;
  rule.editNote = rule.note || "";
  rule.editMatchType = rule.matchType;
  rule.editMatchValue = rule.matchValue;
  rule.editTargetValue = rule.targetValue;
};

const cancelEdit = (rule: EditableReplaceRule) => {
  rule.isEditing = false;
};

const handleUpdateRule = async (rule: EditableReplaceRule) => {
  if (!rule.editMatchValue?.trim()) return;

  rule.isUpdating = true;
  try {
    await rulesStore.updateRule(rule.id, {
      note: rule.editNote || undefined,
      matchType: rule.editMatchType!,
      matchValue: rule.editMatchValue!,
      targetValue: rule.editTargetValue!,
    });
    rule.isEditing = false;
  } finally {
    rule.isUpdating = false;
  }
};

const handleDeleteRule = async (id: number) => {
  if (confirm("确定删除此规则？")) {
    await rulesStore.deleteRule(id);
  }
};

// --- Export / Import Logic ---

const exportConfig = async () => {
  const rules = rulesStore.rules;
  if (rules.length === 0) {
    alert("当前没有规则可导出");
    return;
  }

  const config = {
    version: 1,
    rules: rules.map((rule) => ({
      note: rule.note,
      matchType: rule.matchType,
      matchValue: rule.matchValue,
      targetValue: rule.targetValue,
    })),
  };

  const configStr = JSON.stringify(config);
  const encoded = btoa(unescape(encodeURIComponent(configStr)));
  const url = `context-protector://import/${encoded}`;

  try {
    await navigator.clipboard.writeText(url);
    alert("配置已复制到剪切板！");
  } catch (error) {
    console.error("Failed to copy:", error);
    alert("写入剪切板失败，请手动复制。");
  }
};

const importConfig = async () => {
  let clipText = "";
  try {
    // Attempt automatic read
    clipText = await navigator.clipboard.readText();
  } catch (e) {
    // Ignore error, fallback to prompt
  }

  // Always show prompt if clipboard is empty or access denied,
  // or confirm the content if read successfully
  if (!clipText) {
    const input = prompt("无法直接读取剪切板，请粘贴配置代码:");
    if (input) clipText = input;
  } else {
    // Optional: Ask for confirmation if we read automatically to avoid confusion
    // but "One click import" is usually preferred.
    // Checking if it looks like our config
    if (
      !clipText.includes("context-protector") &&
      !clipText.trim().startsWith("ey")
    ) {
      // If clipboard content doesn't look like config, prompt user
      const input = prompt("剪切板内容似乎不是配置代码，请手动粘贴:", "");
      if (input) clipText = input;
      else return;
    }
  }

  if (!clipText) return;

  try {
    // 1. Clean format
    const prefix = "context-protector://import/";
    let base64Str = clipText.trim();
    if (base64Str.startsWith(prefix)) {
      base64Str = base64Str.slice(prefix.length);
    }

    // 2. Decode
    const jsonStr = decodeURIComponent(escape(window.atob(base64Str)));
    const config = JSON.parse(jsonStr);

    if (!config || !Array.isArray(config.rules)) {
      throw new Error("Invalid format");
    }

    // 3. De-duplication Logic
    const newRules = config.rules;
    const currentRules = rulesStore.rules;

    let addedCount = 0;
    let skippedCount = 0;

    for (const r of newRules) {
      // Comparison: matchType + matchValue + targetValue (Ignore Note)
      const isDuplicate = currentRules.some(
        (existing) =>
          existing.matchType === (r.matchType || "fixed") &&
          existing.matchValue === r.matchValue &&
          existing.targetValue === (r.targetValue || ""),
      );

      if (isDuplicate) {
        skippedCount++;
        continue;
      }

      if (r.matchValue) {
        await rulesStore.addRule({
          note: r.note,
          matchType: r.matchType === "regex" ? "regex" : "fixed",
          matchValue: r.matchValue,
          targetValue: r.targetValue || "",
        });
        addedCount++;
      }
    }

    alert(
      `导入完成。\n成功添加：${addedCount} 条\n已存在跳过：${skippedCount} 条`,
    );
  } catch (error) {
    console.error("Import failed:", error);
    alert("导入失败：内容格式不正确。");
  }
};
</script>

<style scoped>
/*
  Fix for Safari/Chrome:
  Ensure summary handles the custom flex layout properly and hides the default marker
*/
summary::-webkit-details-marker {
  display: none;
}
</style>
