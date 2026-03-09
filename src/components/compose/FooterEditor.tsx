import { useRef } from "react";
import MergeTagButton from "./MergeTagButton";
import MergeTagEditor, { getInsertTag } from "./MergeTagEditor";

interface FooterEditorProps {
  value: string;
  onChange: (value: string) => void;
}

const FooterEditor = ({ value, onChange }: FooterEditorProps) => {
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
    <div className="border-t pt-3">
      <div className="mb-1.5 flex items-center justify-between">
        <label className="block text-xs font-medium text-muted-foreground">Footer</label>
        <MergeTagButton onInsert={handleInsertTag} compact />
      </div>
      <div ref={editorWrapperRef}>
        <MergeTagEditor
          value={value}
          onChange={onChange}
          placeholder="Optional footer text (e.g. compliance, unsubscribe info)..."
          multiline
          maxHeight={120}
          className="text-xs leading-relaxed text-foreground"
        />
      </div>
    </div>
  );
};

export default FooterEditor;
