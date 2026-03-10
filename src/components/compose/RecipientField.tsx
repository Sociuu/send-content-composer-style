import { X, User, Users, Globe, Hash } from "lucide-react";
import { useState, useMemo } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type RecipientType = "user" | "group" | "all" | "channel";

interface Recipient {
  name: string;
  type: RecipientType;
  count?: number;
}

const emailRecipients: Recipient[] = [
  { name: "All employees", type: "all", count: 847 },
  { name: "Marketing Team", type: "group", count: 24 },
  { name: "Engineering", type: "group", count: 56 },
  { name: "Sales", type: "group", count: 31 },
  { name: "John Smith", type: "user" },
  { name: "Jane Doe", type: "user" },
  { name: "Alex Johnson", type: "user" },
  { name: "Sarah Williams", type: "user" },
  { name: "Mike Brown", type: "user" },
];

const messagingRecipients: Recipient[] = [
  { name: "General", type: "channel", count: 312 },
  { name: "Marketing", type: "channel", count: 24 },
  { name: "Engineering", type: "channel", count: 56 },
  { name: "Announcements", type: "channel", count: 847 },
  { name: "Sales", type: "channel", count: 31 },
  { name: "Random", type: "channel", count: 198 },
];

function getIcon(type: RecipientType) {
  switch (type) {
    case "all": return Globe;
    case "group": return Users;
    case "channel": return Hash;
    default: return User;
  }
}

function getTypeLabel(type: RecipientType) {
  switch (type) {
    case "all": return "everyone";
    case "channel": return "channel";
    default: return type;
  }
}

interface RecipientFieldProps {
  selected: string[];
  onSelectedChange: (selected: string[]) => void;
  channel?: "email" | "slack" | "teams";
}

const MAX_VISIBLE = 4;

const RecipientChip = ({
  recipient,
  onRemove,
}: {
  recipient: Recipient;
  onRemove: () => void;
}) => {
  const Icon = getIcon(recipient.type);
  const isAll = recipient.type === "all";
  const isGroup = recipient.type === "group";

  return (
    <span
      className={`flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium ${
        isAll
          ? "bg-primary text-primary-foreground"
          : isGroup
            ? "bg-primary/10 border border-primary/15 text-secondary-foreground"
            : "bg-secondary text-secondary-foreground"
      }`}
    >
      <Icon className={`h-3 w-3 shrink-0 ${isAll ? "text-primary-foreground/70" : "text-muted-foreground"}`} />
      {recipient.name}
      {recipient.count != null && (
        <span className={`text-[10px] font-normal ${isAll ? "text-primary-foreground/60" : "text-muted-foreground"}`}>
          · ~{recipient.count}
        </span>
      )}
      <button
        onClick={onRemove}
        className="text-muted-foreground transition-colors hover:text-foreground"
      >
        <X className="h-3 w-3" />
      </button>
    </span>
  );
};

const RecipientField = ({ selected, onSelectedChange, channel = "email" }: RecipientFieldProps) => {
  const [inputValue, setInputValue] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showOverflow, setShowOverflow] = useState(false);

  const isMessaging = channel === "slack" || channel === "teams";
  const availableRecipients = isMessaging ? messagingRecipients : emailRecipients;

  const selectedRecipients = useMemo(
    () =>
      selected
        .map((name) => availableRecipients.find((r) => r.name === name))
        .filter(Boolean) as Recipient[],
    [selected, availableRecipients]
  );

  const filtered = availableRecipients.filter(
    (r) =>
      !selected.includes(r.name) &&
      r.name.toLowerCase().includes(inputValue.toLowerCase())
  );

  const visibleRecipients = selectedRecipients.slice(0, MAX_VISIBLE);
  const overflowRecipients = selectedRecipients.slice(MAX_VISIBLE);
  const overflowUsers = overflowRecipients.filter((r) => r.type === "user");
  const overflowGroups = overflowRecipients.filter((r) => r.type === "group");
  const overflowChannels = overflowRecipients.filter((r) => r.type === "channel");

  const addRecipient = (name: string) => {
    onSelectedChange([...selected, name]);
    setInputValue("");
    // Keep suggestions open so user can select more
  };

  const removeRecipient = (name: string) => {
    onSelectedChange(selected.filter((r) => r !== name));
  };

  const overflowParts = [
    overflowUsers.length > 0 ? `${overflowUsers.length} user${overflowUsers.length > 1 ? "s" : ""}` : null,
    overflowGroups.length > 0 ? `${overflowGroups.length} group${overflowGroups.length > 1 ? "s" : ""}` : null,
    overflowChannels.length > 0 ? `${overflowChannels.length} channel${overflowChannels.length > 1 ? "s" : ""}` : null,
  ].filter(Boolean).join(", ");

  const toLabel = isMessaging ? "Channel" : "To";
  const ToIcon = isMessaging ? Hash : Users;
  const placeholder = isMessaging
    ? (selected.length === 0 ? "Add channels..." : "Add...")
    : (selected.length === 0 ? "Add recipients..." : "Add...");

  return (
    <div className="relative">
      <div className="flex items-start gap-2 border-b px-0 py-3">
        <span className="flex items-center gap-1.5 pt-1 text-xs font-medium text-muted-foreground">
          <ToIcon className="h-3.5 w-3.5" />
          {toLabel}
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
                  + {overflowParts}
                </button>
              </PopoverTrigger>
              <PopoverContent align="start" className="w-64 p-2">
                <p className="px-2 pb-1.5 text-[11px] font-medium text-muted-foreground">
                  All recipients ({selectedRecipients.length})
                </p>
                <div className="max-h-48 space-y-0.5 overflow-y-auto">
                  {selectedRecipients.map((recipient) => {
                    const Icon = getIcon(recipient.type);
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
            placeholder={placeholder}
            className="min-w-[80px] flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
          />
        </div>
      </div>

      {showSuggestions && filtered.length > 0 && (
        <div className="absolute left-0 right-0 top-full z-10 mt-1 rounded-lg border bg-card p-1 compose-shadow-elevated">
          {filtered.map((recipient) => {
            const Icon = getIcon(recipient.type);
            const typeLabel = getTypeLabel(recipient.type);
            return (
              <button
                key={recipient.name}
                onMouseDown={(e) => {
                  e.preventDefault();
                  addRecipient(recipient.name);
                }}
                className={`flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm transition-colors hover:bg-secondary ${
                  recipient.type === "all" ? "text-foreground font-medium" : "text-foreground"
                }`}
              >
                <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="flex-1">{recipient.name}</span>
                {recipient.count != null && (
                  <span className="text-[10px] text-muted-foreground">~{recipient.count}</span>
                )}
                <span className="text-[10px] text-muted-foreground capitalize">
                  {typeLabel}
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
