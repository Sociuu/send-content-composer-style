import { useRef, useEffect, useCallback } from "react";
import { MERGE_TAGS } from "./MergeTagButton";

/**
 * A contentEditable editor that renders {{merge_tags}} as styled inline chips.
 * Stores plain text with {{tag}} placeholders, but displays them as badges.
 */

const TAG_REGEX = /(\{\{[a-z_.]+\}\})/g;

function tagToLabel(tag: string): string {
  const found = MERGE_TAGS.find((t) => t.value === tag);
  return found ? found.label : tag.replace(/\{|\}/g, "");
}

function valueToHtml(value: string): string {
  if (!value) return "";
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\n/g, "<br>")
    .replace(TAG_REGEX, (match) => {
      const label = tagToLabel(match);
      return `<span contenteditable="false" data-merge-tag="${match}" class="merge-tag-chip">${label}</span>`;
    });
}

function htmlToValue(el: HTMLElement): string {
  let result = "";
  el.childNodes.forEach((node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      result += node.textContent || "";
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const element = node as HTMLElement;
      if (element.tagName === "BR") {
        result += "\n";
      } else if (element.dataset.mergeTag) {
        result += element.dataset.mergeTag;
      } else if (element.tagName === "DIV" || element.tagName === "P") {
        // contentEditable wraps lines in divs
        if (result.length > 0 && !result.endsWith("\n")) {
          result += "\n";
        }
        result += htmlToValue(element);
      } else {
        result += htmlToValue(element);
      }
    }
  });
  return result;
}

function saveCursorPosition(el: HTMLElement): number {
  const sel = window.getSelection();
  if (!sel || sel.rangeCount === 0) return 0;
  const range = sel.getRangeAt(0);
  const preRange = range.cloneRange();
  preRange.selectNodeContents(el);
  preRange.setEnd(range.startContainer, range.startOffset);
  // Count text length including merge tags
  const fragment = preRange.cloneContents();
  const tempDiv = document.createElement("div");
  tempDiv.appendChild(fragment);
  return htmlToValue(tempDiv).length;
}

function restoreCursorPosition(el: HTMLElement, targetPos: number) {
  const sel = window.getSelection();
  if (!sel) return;

  let currentPos = 0;
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_ALL);
  let node: Node | null = walker.nextNode();

  while (node) {
    if (node.nodeType === Node.TEXT_NODE) {
      const len = (node.textContent || "").length;
      if (currentPos + len >= targetPos) {
        const range = document.createRange();
        range.setStart(node, targetPos - currentPos);
        range.collapse(true);
        sel.removeAllRanges();
        sel.addRange(range);
        return;
      }
      currentPos += len;
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const element = node as HTMLElement;
      if (element.dataset.mergeTag) {
        const tagLen = element.dataset.mergeTag.length;
        if (currentPos + tagLen >= targetPos) {
          // Place cursor after this chip
          const range = document.createRange();
          range.setStartAfter(element);
          range.collapse(true);
          sel.removeAllRanges();
          sel.addRange(range);
          return;
        }
        currentPos += tagLen;
        // Skip children of the chip
        let next = walker.nextSibling();
        if (next) {
          node = next;
          continue;
        }
      } else if (element.tagName === "BR") {
        currentPos += 1;
        if (currentPos >= targetPos) {
          const range = document.createRange();
          range.setStartAfter(element);
          range.collapse(true);
          sel.removeAllRanges();
          sel.addRange(range);
          return;
        }
      }
    }
    node = walker.nextNode();
  }

  // If we couldn't place it, put at end
  const range = document.createRange();
  range.selectNodeContents(el);
  range.collapse(false);
  sel.removeAllRanges();
  sel.addRange(range);
}

interface MergeTagEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  multiline?: boolean;
  className?: string;
  maxHeight?: number;
}

const MergeTagEditor = ({
  value,
  onChange,
  placeholder,
  multiline = false,
  className = "",
  maxHeight,
}: MergeTagEditorProps) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const isComposing = useRef(false);
  const lastValue = useRef(value);

  // Sync HTML when value changes externally (e.g. merge tag insertion)
  useEffect(() => {
    const el = editorRef.current;
    if (!el) return;
    if (lastValue.current === value) return;
    lastValue.current = value;

    const cursorPos = saveCursorPosition(el);
    el.innerHTML = valueToHtml(value);
    // Try to restore near the right position
    restoreCursorPosition(el, cursorPos);
  }, [value]);

  // Initial render
  useEffect(() => {
    const el = editorRef.current;
    if (!el) return;
    el.innerHTML = valueToHtml(value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleInput = useCallback(() => {
    if (isComposing.current) return;
    const el = editorRef.current;
    if (!el) return;
    const newValue = htmlToValue(el);
    lastValue.current = newValue;
    onChange(newValue);
  }, [onChange]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!multiline && e.key === "Enter") {
        e.preventDefault();
      }
    },
    [multiline]
  );

  const handlePaste = useCallback(
    (e: React.ClipboardEvent) => {
      e.preventDefault();
      const text = e.clipboardData.getData("text/plain");
      // Insert plain text (which may contain {{tags}})
      const el = editorRef.current;
      if (!el) return;
      const sel = window.getSelection();
      if (!sel || sel.rangeCount === 0) return;
      const range = sel.getRangeAt(0);
      range.deleteContents();
      range.insertNode(document.createTextNode(text));
      range.collapse(false);
      sel.removeAllRanges();
      sel.addRange(range);
      // Now re-parse
      const newValue = htmlToValue(el);
      lastValue.current = newValue;
      onChange(newValue);
      // Re-render with chips
      requestAnimationFrame(() => {
        const pos = saveCursorPosition(el);
        el.innerHTML = valueToHtml(newValue);
        restoreCursorPosition(el, pos);
      });
    },
    [onChange]
  );

  // Insert a tag at current cursor (called from parent via ref or callback)
  const insertTag = useCallback(
    (tag: string) => {
      const el = editorRef.current;
      if (!el) return;
      el.focus();
      const sel = window.getSelection();
      if (!sel || sel.rangeCount === 0) return;

      const cursorPos = saveCursorPosition(el);
      const newValue =
        value.slice(0, cursorPos) + tag + value.slice(cursorPos);
      lastValue.current = newValue;
      onChange(newValue);

      requestAnimationFrame(() => {
        el.innerHTML = valueToHtml(newValue);
        restoreCursorPosition(el, cursorPos + tag.length);
      });
    },
    [value, onChange]
  );

  // Expose insertTag via a ref-like pattern using data attribute
  useEffect(() => {
    const el = editorRef.current;
    if (el) {
      (el as any).__insertTag = insertTag;
    }
  }, [insertTag]);

  const isEmpty = !value;

  return (
    <div className="relative flex-1">
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        onCompositionStart={() => {
          isComposing.current = true;
        }}
        onCompositionEnd={() => {
          isComposing.current = false;
          handleInput();
        }}
        data-placeholder={placeholder}
        className={`merge-tag-editor outline-none ${isEmpty ? "is-empty" : ""} ${className}`}
        style={{
          maxHeight: maxHeight || undefined,
          overflowY: maxHeight ? "auto" : undefined,
          minHeight: multiline ? "3.5rem" : undefined,
          whiteSpace: multiline ? "pre-wrap" : "nowrap",
          overflowX: multiline ? undefined : "hidden",
        }}
      />
    </div>
  );
};

export default MergeTagEditor;

// Helper to get insertTag from a ref
export function getInsertTag(
  editorEl: HTMLDivElement | null
): ((tag: string) => void) | null {
  if (!editorEl) return null;
  return (editorEl as any).__insertTag || null;
}
