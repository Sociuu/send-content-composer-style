import { useRef } from "react";
import MergeTagButton from "./MergeTagButton";
import MergeTagEditor, { getInsertTag } from "./MergeTagEditor";

interface BodyEditorProps {
  value: string;
  onChange: (value: string) => void;
}

const BodyEditor = ({ value, onChange }: BodyEditorProps) => {
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
    <div className="flex-1 py-4">
      <div className="mb-2 flex justify-end">
        <MergeTagButton onInsert={handleInsertTag} />
      </div>
      <div ref={editorWrapperRef}>
        <MergeTagEditor
          value={value}
          onChange={onChange}
          placeholder="Write your message..."
          multiline
          maxHeight={320}
          className="text-sm leading-relaxed text-foreground"
        />
      </div>
    </div>
  );
};

export default BodyEditor;
