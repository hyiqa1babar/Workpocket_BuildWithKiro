import { useEffect } from 'react';

type KeyCombo = {
  key: string;
  ctrlKey?: boolean;
  metaKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
};

export function useKeyboardShortcut(
  combo: KeyCombo,
  callback: (event: KeyboardEvent) => void,
  target: HTMLElement | Document = document
) {
  useEffect(() => {
    const handler = (event: Event) => {
      const e = event as KeyboardEvent;
      
      // Ignore shortcut when typing in input, textarea or select, unless shortcut specifically includes Ctrl/Meta
      const activeTag = document.activeElement?.tagName?.toLowerCase();
      const isInputActive = activeTag === 'input' || activeTag === 'textarea' || document.activeElement?.getAttribute('contenteditable') === 'true';
      
      if (isInputActive && !combo.ctrlKey && !combo.metaKey) {
        return;
      }

      const keyMatch = e.key.toLowerCase() === combo.key.toLowerCase();
      const ctrlMatch = combo.ctrlKey ? e.ctrlKey || e.metaKey : !e.ctrlKey && !e.metaKey;
      const shiftMatch = combo.shiftKey ? e.shiftKey : !e.shiftKey;
      const altMatch = combo.altKey ? e.altKey : !e.altKey;

      if (keyMatch && ctrlMatch && shiftMatch && altMatch) {
        e.preventDefault();
        callback(e);
      }
    };

    target.addEventListener('keydown', handler);
    return () => {
      target.removeEventListener('keydown', handler);
    };
  }, [combo, callback, target]);
}
