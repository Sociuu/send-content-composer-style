import { X, Users } from "lucide-react";
import { useState } from "react";

const mockRecipients = ["Marketing Team", "All Employees", "Engineering", "Sales"];

const RecipientField = () => {
  const [selected, setSelected] = useState<string[]>(["Marketing Team"]);
  const [inputValue, setInputValue] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const filtered = mockRecipients.filter(
    (r) => !selected.includes(r) && r.toLowerCase().includes(inputValue.toLowerCase())
  );

  const addRecipient = (name: string) => {
    setSelected([...selected, name]);
    setInputValue("");
    setShowSuggestions(false);
  };

  const removeRecipient = (name: string) => {
    setSelected(selected.filter((r) => r !== name));
  };

  return (
    <div className="relative">
      <div className="flex items-start gap-2 border-b px-0 py-3">
        <span className="flex items-center gap-1.5 pt-1 text-xs font-medium text-muted-foreground">
          <Users className="h-3.5 w-3.5" />
          To
        </span>
        <div className="flex flex-1 flex-wrap items-center gap-1.5">
          {selected.map((name) => (
            <span
              key={name}
              className="flex items-center gap-1 rounded-md bg-secondary px-2 py-1 text-xs font-medium text-secondary-foreground"
            >
              {name}
              <button
                onClick={() => removeRecipient(name)}
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
          <input
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
            placeholder="Add recipients..."
            className="min-w-[120px] flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
          />
        </div>
      </div>

      {showSuggestions && filtered.length > 0 && (
        <div className="absolute left-0 right-0 top-full z-10 mt-1 rounded-lg border bg-card p-1 compose-shadow-elevated">
          {filtered.map((name) => (
            <button
              key={name}
              onMouseDown={() => addRecipient(name)}
              className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-foreground transition-colors hover:bg-secondary"
            >
              <Users className="h-3.5 w-3.5 text-muted-foreground" />
              {name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecipientField;
