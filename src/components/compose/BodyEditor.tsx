import { useRef, useEffect } from "react";

interface BodyEditorProps {
  value: string;
  onChange: (value: string) => void;
}

const BodyEditor = ({ value, onChange }: BodyEditorProps) => {
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 320)}px`;
  }, [value]);

  return (
    <div className="flex-1 py-4">
      <textarea
        ref={ref}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Write your message..."
        rows={3}
        className="w-full resize-none overflow-y-auto bg-transparent text-sm leading-relaxed text-foreground outline-none placeholder:text-muted-foreground"
        style={{ maxHeight: 320 }}
      />
    </div>
  );
};

export default BodyEditor;
