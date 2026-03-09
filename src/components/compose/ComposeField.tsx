import { useRef } from "react";
import MergeTagButton from "./MergeTagButton";

interface ComposeFieldProps {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  small?: boolean;
}

const ComposeField = ({ label, placeholder, value, onChange, small }: ComposeFieldProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleInsertTag = (tag: string) => {
    const el = inputRef.current;
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
    <div className="flex items-center gap-2 border-b px-0 py-3">
      <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">{label}</span>
      <input
        ref={inputRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`flex-1 bg-transparent text-foreground outline-none placeholder:text-muted-foreground ${
          small ? "text-sm" : "text-sm font-medium"
        }`}
      />
      <MergeTagButton onInsert={handleInsertTag} compact />
    </div>
  );
};

export default ComposeField;
