interface FooterEditorProps {
  value: string;
  onChange: (value: string) => void;
}

const FooterEditor = ({ value, onChange }: FooterEditorProps) => {
  return (
    <div className="border-t pt-3">
      <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Footer</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Optional footer text (e.g. compliance, unsubscribe info)..."
        className="min-h-[64px] w-full resize-none bg-transparent text-xs leading-relaxed text-foreground outline-none placeholder:text-muted-foreground"
      />
    </div>
  );
};

export default FooterEditor;
