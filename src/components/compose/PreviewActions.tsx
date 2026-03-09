import { useState, useRef, useEffect } from "react";
import { Eye, Send, Plus, X, ChevronDown, Check, Search } from "lucide-react";
import { cn } from "@/lib/utils";

const MOCK_ADMINS = [
  { id: "1", name: "You", email: "you@company.com", isSelf: true },
  { id: "2", name: "Sarah Chen", email: "sarah@company.com", isSelf: false },
  { id: "3", name: "Marcus Lee", email: "marcus@company.com", isSelf: false },
  { id: "4", name: "Emma Wilson", email: "emma@company.com", isSelf: false },
  { id: "5", name: "James Park", email: "james@company.com", isSelf: false },
  { id: "6", name: "Lisa Andersen", email: "lisa@company.com", isSelf: false },
  { id: "7", name: "David Kim", email: "david@company.com", isSelf: false },
  { id: "8", name: "Nina Patel", email: "nina@company.com", isSelf: false },
];

interface PreviewActionsProps {
  onViewPreview?: () => void;
}

const PreviewActions = ({ onViewPreview }: PreviewActionsProps) => {
  const [sendOpen, setSendOpen] = useState(false);
  const [selectedAdminIds, setSelectedAdminIds] = useState<string[]>(["1"]);
  const [showOtherEmails, setShowOtherEmails] = useState(false);
  const [otherEmails, setOtherEmails] = useState<string[]>([]);
  const [newEmail, setNewEmail] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!sendOpen) return;
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setSendOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [sendOpen]);

  const toggleAdmin = (id: string) => {
    setSelectedAdminIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleAddEmail = () => {
    const trimmed = newEmail.trim();
    if (trimmed && trimmed.includes("@") && !otherEmails.includes(trimmed)) {
      setOtherEmails((prev) => [...prev, trimmed]);
      setNewEmail("");
    }
  };

  const handleRemoveEmail = (email: string) => {
    setOtherEmails((prev) => prev.filter((e) => e !== email));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddEmail();
    }
  };

  const totalRecipients = selectedAdminIds.length + otherEmails.length;

  const filteredAdmins = MOCK_ADMINS.filter(
    (a) =>
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex items-center gap-1.5">
      {/* View Preview */}
      <button
        onClick={onViewPreview}
        className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
      >
        <Eye className="h-3.5 w-3.5" />
        Preview
      </button>

      {/* Send Preview */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setSendOpen(!sendOpen)}
          className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          <Send className="h-3.5 w-3.5" />
          Send Preview
          <ChevronDown className={cn("h-3 w-3 transition-transform", sendOpen && "rotate-180")} />
        </button>

        {sendOpen && (
          <div className="absolute right-0 top-full z-50 mt-1.5 w-80 rounded-xl border bg-card shadow-lg">
            <div className="p-3">
              <p className="mb-2 text-[11px] font-semibold text-foreground">Send preview to</p>

              {/* Search */}
              <div className="relative mb-2">
                <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search admins..."
                  className="w-full rounded-lg border bg-background py-1.5 pl-8 pr-3 text-xs text-foreground outline-none placeholder:text-muted-foreground focus:ring-1 focus:ring-ring"
                />
              </div>

              {/* Admin multi-select list */}
              <div className="max-h-40 space-y-0.5 overflow-y-auto">
                {filteredAdmins.map((admin) => {
                  const selected = selectedAdminIds.includes(admin.id);
                  return (
                    <button
                      key={admin.id}
                      onClick={() => toggleAdmin(admin.id)}
                      className={cn(
                        "flex w-full items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-left text-xs transition-colors hover:bg-secondary",
                        selected && "bg-primary/5"
                      )}
                    >
                      <div
                        className={cn(
                          "flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors",
                          selected
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-muted-foreground/30"
                        )}
                      >
                        {selected && <Check className="h-3 w-3" />}
                      </div>
                      <div className="flex min-w-0 flex-1 items-center gap-1.5">
                        <span className="truncate font-medium text-foreground">
                          {admin.name}
                          {admin.isSelf && (
                            <span className="ml-1 text-[10px] font-normal text-muted-foreground">(you)</span>
                          )}
                        </span>
                        <span className="shrink-0 text-[11px] text-muted-foreground">{admin.email}</span>
                      </div>
                    </button>
                  );
                })}
                {filteredAdmins.length === 0 && (
                  <p className="px-2.5 py-3 text-center text-xs text-muted-foreground">No admins found</p>
                )}
              </div>
            </div>

            {/* Other emails addon */}
            <div className="border-t px-3 py-2.5">
              {!showOtherEmails ? (
                <button
                  onClick={() => setShowOtherEmails(true)}
                  className="flex items-center gap-1 text-[11px] font-medium text-primary transition-colors hover:text-primary/80"
                >
                  <Plus className="h-3 w-3" />
                  Add other email addresses
                </button>
              ) : (
                <div className="space-y-1.5">
                  <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                    Additional recipients
                  </p>
                  {otherEmails.map((email) => (
                    <div
                      key={email}
                      className="flex items-center justify-between rounded-md bg-secondary px-2 py-1"
                    >
                      <span className="text-xs text-foreground">{email}</span>
                      <button
                        onClick={() => handleRemoveEmail(email)}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                  <div className="flex gap-1.5">
                    <input
                      type="email"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="email@example.com"
                      className="flex-1 rounded-md border bg-background px-2 py-1.5 text-xs text-foreground outline-none placeholder:text-muted-foreground focus:ring-1 focus:ring-ring"
                    />
                    <button
                      onClick={handleAddEmail}
                      className="rounded-md bg-primary px-2.5 py-1.5 text-[11px] font-medium text-primary-foreground hover:opacity-90"
                    >
                      Add
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Send button */}
            <div className="border-t px-3 py-2.5">
              <button
                disabled={totalRecipients === 0}
                className="w-full rounded-lg bg-primary py-2 text-xs font-semibold text-primary-foreground transition-all hover:opacity-90 disabled:opacity-50"
              >
                Send Preview{totalRecipients > 0 && ` to ${totalRecipients}`}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PreviewActions;
