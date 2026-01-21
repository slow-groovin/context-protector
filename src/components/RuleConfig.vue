<template>
    <details class="bg-white rounded-lg shadow p-2 mb-2">
        <summary class="cursor-pointer text-xl font-semibold mb-2">
            规则配置
        </summary>



        <!-- Add New Rule Form -->
        <div class="mb-4 p-2 border border-gray-200 rounded-lg">
        <h3 class="text-lg font-medium mb-2">添加新规则</h3>
        <form @submit.prevent="handleAddRule" class="space-y-2">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label class="block text-sm font-medium mb-1">备注</label>
              <input
                v-model="newRule.note"
                type="text"
                class="w-full p-2 border border-gray-300 rounded"
                placeholder="规则名称（可选）"
              />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">匹配类型</label>
              <select
                v-model="newRule.matchType"
                class="w-full p-2 border border-gray-300 rounded"
              >
                <option value="fixed">固定字符串</option>
                <option value="regex">正则表达式</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">匹配值</label>
              <input
                v-model="newRule.matchValue"
                type="text"
                required
                class="w-full p-2 border border-gray-300 rounded"
                placeholder="要匹配的值"
              />
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">替换为</label>
            <input
              v-model="newRule.targetValue"
              type="text"
              required
              class="w-full p-2 border border-gray-300 rounded"
              placeholder="替换后的值"
            />
          </div>
          <button
            type="submit"
            class="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50"
            :disabled="isAdding"
          >
            {{ isAdding ? "添加中..." : "添加规则" }}
          </button>
        </form>
      </div>

       <!-- Rules List -->
       <div class="space-y-2">
         <div class="flex justify-between items-center">
           <h3 class="text-lg font-medium">当前规则</h3>
           <button
             @click="exportConfig"
             class="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600 text-sm"
             title="导出配置"
           >
             导出配置
           </button>
         </div>
        <div v-if="rulesStore.isLoading" class="text-gray-500 italic">
          加载中...
        </div>
        <div
          v-else-if="rulesStore.rules.length === 0"
          class="text-gray-500 italic"
        >
          暂无规则。
        </div>
        <div
          v-else
          v-for="rule in rulesStore.rules as EditableReplaceRule[]"
          :key="rule.id"
          class="border border-gray-200 rounded-lg"
        >
          <!-- Rule Display -->
          <div
            v-if="!rule.isEditing"
            class="p-2 cursor-pointer hover:bg-gray-50"
            @click="startEdit(rule)"
          >
            <div class="flex items-start">
              <div class="flex-1">
                <div
                  v-if="rule.note"
                  class="text-sm text-gray-600 mb-2"
                >
                  {{ rule.note }}
                </div>
                <div class="flex items-center gap-2 text-sm">
                  <span
                    :class="[
                      'px-2 py-1 rounded text-xs font-mono',
                      rule.matchType === 'regex'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-green-100 text-green-800',
                    ]"
                  >
                    {{
                      rule.matchType === "regex"
                        ? "regex"
                        : "fixed"
                    }}
                  </span>
                  <code class="bg-gray-100 px-2 py-1 rounded">{{
                    rule.matchValue
                  }}</code>
                  <span class="text-gray-500">→</span>
                  <code class="bg-gray-100 px-2 py-1 rounded">{{
                    rule.targetValue
                  }}</code>
                </div>
              </div>
              <div class="flex space-x-2 ml-4">
                <button
                  @click.stop="startEdit(rule)"
                  class="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600 text-sm"
                >
                  编辑
                </button>
                <button
                  @click.stop="handleDeleteRule(rule.id)"
                  class="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600 text-sm"
                >
                  删除
                </button>
              </div>
            </div>
          </div>

          <!-- Edit Form -->
          <div v-else class="p-2 border-t border-gray-200">
            <form
              @submit.prevent="handleUpdateRule(rule)"
              class="space-y-2"
            >
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label class="block text-sm font-medium mb-1">备注</label>
                  <input
                    v-model="rule.editNote"
                    type="text"
                    class="w-full p-2 border border-gray-300 rounded"
                    placeholder="规则名称（可选）"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium mb-1">匹配类型</label>
                  <select
                    v-model="rule.editMatchType"
                    class="w-full p-2 border border-gray-300 rounded"
                  >
                    <option value="fixed">固定字符串</option>
                    <option value="regex">正则表达式</option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium mb-1">匹配值</label>
                  <input
                    v-model="rule.editMatchValue"
                    type="text"
                    required
                    class="w-full p-2 border border-gray-300 rounded"
                    placeholder="要匹配的值"
                  />
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium mb-1">替换为</label>
                <input
                  v-model="rule.editTargetValue"
                  type="text"
                  required
                  class="w-full p-2 border border-gray-300 rounded"
                  placeholder="替换后的值"
                />
              </div>
              <div class="flex space-x-2">
                <button
                  type="submit"
                  class="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  :disabled="rule.isUpdating"
                >
                  {{
                    rule.isUpdating ? "保存中..." : "保存"
                  }}
                </button>
                <button
                  type="button"
                  @click="cancelEdit(rule)"
                  class="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600"
                >
                  取消
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </details>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { useRulesStore, type ReplaceRule } from "../stores/rules";

interface EditableReplaceRule extends ReplaceRule {
    isEditing?: boolean;
    editNote?: string;
    editMatchType?: "fixed" | "regex";
    editMatchValue?: string;
    editTargetValue?: string;
    isUpdating?: boolean;
}

const rulesStore = useRulesStore();

const isAdding = ref(false);

const newRule = reactive({
    note: "",
    matchType: "fixed" as "fixed" | "regex",
    matchValue: "",
    targetValue: "",
});

// Extend rule with edit properties
// const extendRuleForEdit = (rule: ReplaceRule) => {
//     return {
//         ...rule,
//         isEditing: false,
//         editNote: rule.note || "",
//         editMatchType: rule.matchType,
//         editMatchValue: rule.matchValue,
//         editTargetValue: rule.targetValue,
//         isUpdating: false,
//     };
// };

const handleAddRule = async () => {
    if (!newRule.matchValue.trim() || !newRule.targetValue.trim()) return;

    isAdding.value = true;
    try {
        await rulesStore.addRule({
            note: newRule.note || undefined,
            matchType: newRule.matchType,
            matchValue: newRule.matchValue,
            targetValue: newRule.targetValue,
        });

        // Reset form
        newRule.note = "";
        newRule.matchType = "fixed";
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
    if (!rule.editMatchValue?.trim() || !rule.editTargetValue?.trim()) return;

    rule.isUpdating = true;
    try {
        await rulesStore.updateRule(rule.id, {
            note: rule.editNote || undefined,
            matchType: rule.editMatchType!,
            matchValue: rule.editMatchValue!,
            targetValue: rule.editTargetValue!,
        });
        rule.isEditing = false;
    } catch (error) {
        console.error("Failed to update rule:", error);
    } finally {
        rule.isUpdating = false;
    }
};

const handleDeleteRule = async (id: number) => {
    if (confirm("确定要删除这个规则吗？")) {
        try {
            await rulesStore.deleteRule(id);
        } catch (error) {
            console.error("Failed to delete rule:", error);
        }
    }
};

const exportConfig = async () => {
    const rules = rulesStore.rules;
    const config = {
        version: 1,
        rules: rules.map(rule => ({
            note: rule.note,
            matchType: rule.matchType,
            matchValue: rule.matchValue,
            targetValue: rule.targetValue
        }))
    };
    const configStr = JSON.stringify(config);
    const encoded = btoa(unescape(encodeURIComponent(configStr)));
    const url = `context-protector://import/${encoded}`;

    try {
        await navigator.clipboard.writeText(url);
        alert("配置已复制到剪切板！");
    } catch (error) {
        console.error("Failed to copy config:", error);
        alert("复制配置失败");
    }
};


</script>
