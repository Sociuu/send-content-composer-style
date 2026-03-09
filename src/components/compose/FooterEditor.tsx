import { useRef, useEffect } from "react";

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

  return (
    <div className="border-t pt-3">
      <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Footer</label>
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
