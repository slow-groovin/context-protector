// src/utils/shortcuts.ts
// 快捷键配置和处理

export interface Shortcut {
  key: string;
  ctrlKey?: boolean;
  action: string;
  description: string;
}

export const shortcuts: Shortcut[] = [
  {
    key: "Enter",
    ctrlKey: true,
    action: "replace",
    description: "Ctrl+Enter",
  },
];

export function handleKeyboardShortcuts(
  event: KeyboardEvent,
  actions: Record<string, () => void>,
) {
  // 检查其他快捷键
  const shortcut = shortcuts.find(
    (s) =>
      s.key === event.key &&
      (s.ctrlKey === undefined || s.ctrlKey === event.ctrlKey),
  );

  if (shortcut) {
    event.preventDefault();
    actions[shortcut.action]?.();
  }
}
