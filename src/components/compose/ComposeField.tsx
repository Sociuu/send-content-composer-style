interface ComposeFieldProps {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  small?: boolean;
}

const ComposeField = ({ label, placeholder, value, onChange, small }: ComposeFieldProps) => {
  return (
    <div className="flex items-center gap-2 border-b px-0 py-3">
      <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`flex-1 bg-transparent text-foreground outline-none placeholder:text-muted-foreground ${
          small ? "text-sm" : "text-sm font-medium"
        }`}
      />
    </div>
  );
};

export default ComposeField;
