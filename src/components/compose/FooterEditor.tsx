import { useRef, useEffect } from "react";
import MergeTagButton from "./MergeTagButton";

interface FooterEditorProps {
  value: string;
  onChange: (value: string) => void;
}

const FooterEditor = ({ value, onChange }: FooterEditorProps) => {
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  }, [value]);

  const handleInsertTag = (tag: string) => {
    const el = ref.current;
    if (el) {
      const start = el.selectionStart ?? value.length;
      const end = el.selectionEnd ?? value.length;
      const newValue = value.slice(0, start) + tag + value.slice(end);
      onChange(newValue);
      requestAnimationFrame(() => {
        el.focus();
        const pos = start + tag.length;
        el.setSelectionRange(pos, pos);
      });
    } else {
      onChange(value + tag);
    }
  };

  return (
    <div className="border-t pt-3">
      <div className="mb-1.5 flex items-center justify-between">
        <label className="block text-xs font-medium text-muted-foreground">Footer</label>
        <MergeTagButton onInsert={handleInsertTag} compact />
      </div>
      <textarea
        ref={ref}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Optional footer text (e.g. compliance, unsubscribe info)..."
        rows={1}
        className="w-full resize-none overflow-y-auto bg-transparent text-xs leading-relaxed text-foreground outline-none placeholder:text-muted-foreground"
        style={{ maxHeight: 120 }}
      />
    </div>
  );
};

export default FooterEditor;
