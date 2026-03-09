import { useRef } from "react";
import MergeTagButton from "./MergeTagButton";
import MergeTagEditor, { getInsertTag } from "./MergeTagEditor";

interface ComposeFieldProps {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  small?: boolean;
}

const ComposeField = ({ label, placeholder, value, onChange, small }: ComposeFieldProps) => {
  const editorWrapperRef = useRef<HTMLDivElement>(null);

  const handleInsertTag = (tag: string) => {
    const editorEl = editorWrapperRef.current?.querySelector(".merge-tag-editor") as HTMLDivElement | null;
    const insert = getInsertTag(editorEl);
    if (insert) {
      insert(tag);
    } else {
      onChange(value + tag);
    }
  };

  return (
    <div className="flex items-center gap-2 border-b px-0 py-3">
      <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">{label}</span>
      <div ref={editorWrapperRef} className="flex-1">
        <MergeTagEditor
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={small ? "text-sm" : "text-sm font-medium"}
        />
      </div>
      <MergeTagButton onInsert={handleInsertTag} compact />
    </div>
  );
};

export default ComposeField;
