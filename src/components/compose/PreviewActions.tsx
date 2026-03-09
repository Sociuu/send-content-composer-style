import { useState } from "react";
import { Eye, Send, Plus, X, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const MOCK_ADMINS = [
  { id: "1", name: "You", email: "you@company.com", isSelf: true },
  { id: "2", name: "Sarah Chen", email: "sarah@company.com", isSelf: false },
  { id: "3", name: "Marcus Lee", email: "marcus@company.com", isSelf: false },
];

interface PreviewActionsProps {
  onViewPreview?: () => void;
}

const PreviewActions = ({ onViewPreview }: PreviewActionsProps) => {
  const [sendOpen, setSendOpen] = useState(false);
  const [selectedAdminId, setSelectedAdminId] = useState(MOCK_ADMINS[0].id);
  const [showOtherEmails, setShowOtherEmails] = useState(false);
  const [otherEmails, setOtherEmails] = useState<string[]>([]);
  const [newEmail, setNewEmail] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const selectedAdmin = MOCK_ADMINS.find((a) => a.id === selectedAdminId)!;

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
      <div className="relative">
        <button
          onClick={() => setSendOpen(!sendOpen)}
          className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          <Send className="h-3.5 w-3.5" />
          Send Preview
          <ChevronDown className={cn("h-3 w-3 transition-transform", sendOpen && "rotate-180")} />
        </button>

        {sendOpen && (
          <div className="absolute right-0 top-full z-50 mt-1.5 w-72 rounded-xl border bg-card p-3 shadow-lg">
            <p className="mb-2 text-[11px] font-semibold text-foreground">Send preview to</p>

            {/* Admin selector */}
            <div className="relative mb-2">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex w-full items-center justify-between rounded-lg border bg-background px-3 py-2 text-xs text-foreground"
              >
                <span>
                  {selectedAdmin.name}
                  <span className="ml-1 text-muted-foreground">({selectedAdmin.email})</span>
                </span>
                <ChevronDown className="h-3 w-3 text-muted-foreground" />
              </button>

              {dropdownOpen && (
                <div className="absolute left-0 top-full z-10 mt-1 w-full rounded-lg border bg-card py-1 shadow-md">
                  {MOCK_ADMINS.map((admin) => (
                    <button
                      key={admin.id}
                      onClick={() => {
                        setSelectedAdminId(admin.id);
                        setDropdownOpen(false);
                      }}
                      className={cn(
                        "flex w-full items-center gap-2 px-3 py-1.5 text-left text-xs transition-colors hover:bg-secondary",
                        admin.id === selectedAdminId && "bg-primary/5 font-medium"
                      )}
                    >
                      <span className="text-foreground">{admin.name}</span>
                      <span className="text-muted-foreground">{admin.email}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Other emails addon */}
            {!showOtherEmails ? (
              <button
                onClick={() => setShowOtherEmails(true)}
                className="flex items-center gap-1 text-[11px] font-medium text-primary transition-colors hover:text-primary/80"
              >
                <Plus className="h-3 w-3" />
                Add other email addresses
              </button>
            ) : (
              <div className="mt-1 space-y-1.5">
                <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                  Additional recipients
                </p>
                {otherEmails.map((email) => (
                  <div
                    key={email}
                    className="flex items-center justify-between rounded-md bg-secondary px-2 py-1"
                  >
                    <span className="text-xs text-foreground">{email}</span>
                    <button onClick={() => handleRemoveEmail(email)} className="text-muted-foreground hover:text-foreground">
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

            {/* Send button */}
            <div className="mt-3 border-t pt-2.5">
              <button className="w-full rounded-lg bg-primary py-2 text-xs font-semibold text-primary-foreground transition-all hover:opacity-90">
                Send Preview
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PreviewActions;
