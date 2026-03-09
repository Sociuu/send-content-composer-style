import { useState } from "react";
import { Eye, Send, Plus, X, ChevronDown, Check } from "lucide-react";
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
  const [selectedAdminIds, setSelectedAdminIds] = useState<string[]>(["1"]); // self default
  const [showOtherEmails, setShowOtherEmails] = useState(false);
  const [otherEmails, setOtherEmails] = useState<string[]>([]);
  const [newEmail, setNewEmail] = useState("");

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
          <>
            {/* Backdrop to close */}
            <div className="fixed inset-0 z-40" onClick={() => setSendOpen(false)} />
            <div className="absolute right-0 top-full z-50 mt-1.5 w-72 rounded-xl border bg-card p-3 shadow-lg">
              <p className="mb-2 text-[11px] font-semibold text-foreground">Send preview to</p>

              {/* Admin multi-select */}
              <div className="space-y-0.5">
                {MOCK_ADMINS.map((admin) => {
                  const selected = selectedAdminIds.includes(admin.id);
                  return (
                    <button
                      key={admin.id}
                      onClick={() => toggleAdmin(admin.id)}
                      className={cn(
                        "flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-xs transition-colors hover:bg-secondary",
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
                      <div className="flex flex-col">
                        <span className="font-medium text-foreground">
                          {admin.name}
                          {admin.isSelf && (
                            <span className="ml-1 text-[10px] font-normal text-muted-foreground">(you)</span>
                          )}
                        </span>
                        <span className="text-[11px] text-muted-foreground">{admin.email}</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Other emails addon */}
              <div className="mt-2">
                {!showOtherEmails ? (
                  <button
                    onClick={() => setShowOtherEmails(true)}
                    className="flex items-center gap-1 text-[11px] font-medium text-primary transition-colors hover:text-primary/80"
                  >
                    <Plus className="h-3 w-3" />
                    Add other email addresses
                  </button>
                ) : (
                  <div className="space-y-1.5 border-t pt-2">
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
              <div className="mt-3 border-t pt-2.5">
                <button
                  disabled={totalRecipients === 0}
                  className="w-full rounded-lg bg-primary py-2 text-xs font-semibold text-primary-foreground transition-all hover:opacity-90 disabled:opacity-50"
                >
                  Send Preview{totalRecipients > 0 && ` to ${totalRecipients}`}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PreviewActions;
