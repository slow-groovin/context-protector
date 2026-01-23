import { defineStore } from "pinia";
import { ref } from "vue";
import { getDatabase } from "../database/index";
import { replaceRules } from "../database/schema";
import { eq, desc } from "drizzle-orm";

export interface ReplaceRule {
  id: number;
  note?: string;
  matchType: "fixed" | "regex";
  matchValue: string;
  targetValue: string;
  createdAt: string;
}

export const useRulesStore = defineStore("rules", () => {
  const rules = ref<ReplaceRule[]>([]);
  const isLoading = ref(false);

  // Load rules from database
  const loadRules = async () => {
    isLoading.value = true;
    try {
      const db = await getDatabase();
      if (!db) return;

      const result = await db
        .select()
        .from(replaceRules)
        .orderBy(desc(replaceRules.createdAt));

      rules.value = result.map((row) => ({
        id: row.id,
        note: row.note || undefined,
        matchType: row.matchType as "fixed" | "regex",
        matchValue: row.matchValue,
        targetValue: row.targetValue,
        createdAt: row.createdAt,
      }));
    } catch (error) {
      console.error("Failed to load rules:", error);
    } finally {
      isLoading.value = false;
    }
  };

  // Add new rule
  const addRule = async (rule: Omit<ReplaceRule, "id" | "createdAt">) => {
    try {
      const db = await getDatabase();
      if (!db) return;

      const newRule = {
        ...rule,
        createdAt: new Date().toISOString(),
      };

      const result = await db.insert(replaceRules).values(newRule).returning();

      if (result.length > 0) {
        await loadRules(); // Reload all rules
        return result[0];
      }
    } catch (error) {
      console.error("Failed to add rule:", error);
      throw error;
    }
  };

  // Update rule
  const updateRule = async (
    id: number,
    updates: Partial<Omit<ReplaceRule, "id" | "createdAt">>,
  ) => {
    try {
      const db = await getDatabase();
      if (!db) return;

      await db.update(replaceRules).set(updates).where(eq(replaceRules.id, id));

      await loadRules(); // Reload all rules
    } catch (error) {
      console.error("Failed to update rule:", error);
      throw error;
    }
  };

  // Delete rule
  const deleteRule = async (id: number) => {
    try {
      const db = await getDatabase();
      if (!db) return;

      await db.delete(replaceRules).where(eq(replaceRules.id, id));
      await loadRules(); // Reload all rules
    } catch (error) {
      console.error("Failed to delete rule:", error);
      throw error;
    }
  };

  // Initialize with default rules if none exist
  const initializeDefaultRules = async () => {
    const stored = localStorage.getItem("ruleConfigFirstUse");
    if (stored === null) {
      const defaultRules: Omit<ReplaceRule, "id" | "createdAt">[] = [
        {
          note: "eg. Windows user path",
          matchType: "fixed",
          matchValue: "C:\\Users\\you\\",
          targetValue: "C:\\Users\\samaltman\\",
        },
        {
          note: "eg. Linux user path",
          matchType: "fixed",
          matchValue: "/home/you/",
          targetValue: "/home/samaltman/",
        },
        {
          note: "eg. SSN",
          matchType: "regex",
          matchValue: "\\d{3}-\\d{2}-\\d{4}",
          targetValue: "***-**-****",
        },
      ];

      for (const rule of defaultRules) {
        await addRule(rule);
      }
    }
  };

  return {
    rules,
    isLoading,
    loadRules,
    addRule,
    updateRule,
    deleteRule,
    initializeDefaultRules,
  };
});
