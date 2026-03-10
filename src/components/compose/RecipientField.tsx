import { X, User, Users, Globe } from "lucide-react";
import { useState, useRef, useEffect, useMemo } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type RecipientType = "user" | "group" | "all";

interface Recipient {
  name: string;
  type: RecipientType;
}

const mockRecipients: Recipient[] = [
  { name: "Marketing Team", type: "group" },
  { name: "All Employees", type: "group" },
  { name: "Engineering", type: "group" },
  { name: "Sales", type: "group" },
  { name: "John Smith", type: "user" },
  { name: "Jane Doe", type: "user" },
  { name: "Alex Johnson", type: "user" },
  { name: "Sarah Williams", type: "user" },
  { name: "Mike Brown", type: "user" },
];

interface RecipientFieldProps {
  selected: string[];
  onSelectedChange: (selected: string[]) => void;
}

const MAX_VISIBLE = 4;

const RecipientChip = ({
  recipient,
  onRemove,
}: {
  recipient: Recipient;
  onRemove: () => void;
}) => {
  const isGroup = recipient.type === "group";
  const Icon = isGroup ? Users : User;

  return (
    <span
      className={`flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium text-secondary-foreground ${
        isGroup
          ? "bg-primary/10 border border-primary/15"
          : "bg-secondary"
      }`}
    >
      <Icon className="h-3 w-3 shrink-0 text-muted-foreground" />
      {recipient.name}
      <button
        onClick={onRemove}
        className="text-muted-foreground transition-colors hover:text-foreground"
      >
        <X className="h-3 w-3" />
      </button>
    </span>
  );
};

const RecipientField = ({ selected, onSelectedChange }: RecipientFieldProps) => {
  const [inputValue, setInputValue] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showOverflow, setShowOverflow] = useState(false);

  const selectedRecipients = useMemo(
    () =>
      selected
        .map((name) => mockRecipients.find((r) => r.name === name))
        .filter(Boolean) as Recipient[],
    [selected]
  );

  const filtered = mockRecipients.filter(
    (r) =>
      !selected.includes(r.name) &&
      r.name.toLowerCase().includes(inputValue.toLowerCase())
  );

  const visibleRecipients = selectedRecipients.slice(0, MAX_VISIBLE);
  const overflowRecipients = selectedRecipients.slice(MAX_VISIBLE);
  const overflowUsers = overflowRecipients.filter((r) => r.type === "user");
  const overflowGroups = overflowRecipients.filter((r) => r.type === "group");

  const addRecipient = (name: string) => {
    onSelectedChange([...selected, name]);
    setInputValue("");
    setShowSuggestions(false);
  };

  const removeRecipient = (name: string) => {
    onSelectedChange(selected.filter((r) => r !== name));
  };

  const overflowLabel = [
    overflowUsers.length > 0 ? `${overflowUsers.length} user${overflowUsers.length > 1 ? "s" : ""}` : null,
    overflowGroups.length > 0 ? `${overflowGroups.length} group${overflowGroups.length > 1 ? "s" : ""}` : null,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <div className="relative">
      <div className="flex items-start gap-2 border-b px-0 py-3">
        <span className="flex items-center gap-1.5 pt-1 text-xs font-medium text-muted-foreground">
          <Users className="h-3.5 w-3.5" />
          To
        </span>
        <div className="flex flex-1 flex-wrap items-center gap-1.5">
          {visibleRecipients.map((recipient) => (
            <RecipientChip
              key={recipient.name}
              recipient={recipient}
              onRemove={() => removeRecipient(recipient.name)}
            />
          ))}

          {overflowRecipients.length > 0 && (
            <Popover open={showOverflow} onOpenChange={setShowOverflow}>
              <PopoverTrigger asChild>
                <button className="rounded-md bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
                  + {overflowLabel}
                </button>
              </PopoverTrigger>
              <PopoverContent align="start" className="w-64 p-2">
                <p className="px-2 pb-1.5 text-[11px] font-medium text-muted-foreground">
                  All recipients ({selectedRecipients.length})
                </p>
                <div className="max-h-48 space-y-0.5 overflow-y-auto">
                  {selectedRecipients.map((recipient) => {
                    const Icon = recipient.type === "group" ? Users : User;
                    return (
                      <div
                        key={recipient.name}
                        className="flex items-center justify-between rounded-md px-2 py-1.5 text-sm hover:bg-secondary"
                      >
                        <span className="flex items-center gap-2">
                          <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                          {recipient.name}
                        </span>
                        <button
                          onClick={() => removeRecipient(recipient.name)}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </PopoverContent>
            </Popover>
          )}

          <input
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
            placeholder={selected.length === 0 ? "Add recipients..." : "Add..."}
            className="min-w-[80px] flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
          />
        </div>
      </div>

      {showSuggestions && filtered.length > 0 && (
        <div className="absolute left-0 right-0 top-full z-10 mt-1 rounded-lg border bg-card p-1 compose-shadow-elevated">
          {filtered.map((recipient) => {
            const Icon = recipient.type === "group" ? Users : User;
            return (
              <button
                key={recipient.name}
                onMouseDown={() => addRecipient(recipient.name)}
                className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-foreground transition-colors hover:bg-secondary"
              >
                <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="flex-1">{recipient.name}</span>
                <span className="text-[10px] text-muted-foreground capitalize">
                  {recipient.type}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RecipientField;
