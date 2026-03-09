interface BodyEditorProps {
  value: string;
  onChange: (value: string) => void;
}

const BodyEditor = ({ value, onChange }: BodyEditorProps) => {
  return (
    <div className="flex-1 py-4">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Write your message..."
        className="h-full min-h-[240px] w-full resize-none bg-transparent text-sm leading-relaxed text-foreground outline-none placeholder:text-muted-foreground"
      />
    </div>
  );
};

export default BodyEditor;
