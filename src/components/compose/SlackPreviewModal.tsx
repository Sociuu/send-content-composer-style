import { useState, useRef, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { X, Eye, Send, Hash, Plus, ChevronDown, Check, Search, Link2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ContentItem } from "@/types/content";

/* ─── Mock channel data ─── */
const MOCK_CHANNELS = [
  { id: "1", name: "General" },
  { id: "2", name: "Marketing" },
  { id: "3", name: "Engineering" },
  { id: "4", name: "Announcements" },
  { id: "5", name: "Sales" },
  { id: "6", name: "Random" },
  { id: "7", name: "Design" },
  { id: "8", name: "Product" },
];

/* ─── Slack Preview Modal ─── */
interface SlackPreviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  body: string;
  contentItems: ContentItem[];
}

const SlackPreviewModal = ({
  open,
  onOpenChange,
  body,
  contentItems,
}: SlackPreviewModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-hidden p-0 sm:max-w-xl">
        <DialogHeader className="sr-only">
          <DialogTitle>Slack Preview</DialogTitle>
        </DialogHeader>

        <div className="flex items-center justify-between border-b bg-muted/50 px-5 py-3">
          <span className="text-xs font-semibold text-foreground">Slack Preview</span>
          <button
            onClick={() => onOpenChange(false)}
            className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="overflow-y-auto" style={{ maxHeight: "calc(90vh - 52px)" }}>
          <div className="p-5">
            {/* Simulated Slack message */}
            <div className="rounded-lg border bg-card p-4">
              <div className="flex gap-3">
                {/* Bot avatar */}
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
                  S
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline gap-2">
                    <span className="text-sm font-bold text-foreground">Sociuu</span>
                    <span className="text-[10px] text-muted-foreground">
                      {new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
                    </span>
                  </div>

                  {/* Message body */}
                  <div className="mt-1">
                    {body ? (
                      <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">{body}</p>
                    ) : (
                      <p className="text-sm italic text-muted-foreground">No message text yet...</p>
                    )}
                  </div>

                  {/* Content attachments */}
                  {contentItems.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {contentItems.map((item) => (
                        <div
                          key={item.id}
                          className="rounded-md border-l-[3px] border-l-primary bg-background p-3"
                        >
                          <div className="flex gap-3">
                            <div className="min-w-0 flex-1">
                              <p className="text-xs font-semibold text-primary">{item.title}</p>
                              <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                                {item.text}
                              </p>
                              {item.linkDomain && (
                                <p className="mt-1 text-[10px] text-muted-foreground">{item.linkDomain}</p>
                              )}
                            </div>
                            {item.thumbnail && (
                              <img
                                src={item.thumbnail}
                                alt={item.title}
                                className="h-16 w-16 shrink-0 rounded object-cover"
                              />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

/* ─── Slack Preview Actions ─── */
interface SlackPreviewActionsProps {
  onViewPreview?: () => void;
}

const SlackPreviewActions = ({ onViewPreview }: SlackPreviewActionsProps) => {
  const [sendOpen, setSendOpen] = useState(false);
  const [selectedChannelIds, setSelectedChannelIds] = useState<string[]>([]);
  const [showWebhook, setShowWebhook] = useState(false);
  const [webhookUrls, setWebhookUrls] = useState<string[]>([]);
  const [newWebhook, setNewWebhook] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  const toggleChannel = (id: string) => {
    setSelectedChannelIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleAddWebhook = () => {
    const trimmed = newWebhook.trim();
    if (trimmed && trimmed.startsWith("http") && !webhookUrls.includes(trimmed)) {
      setWebhookUrls((prev) => [...prev, trimmed]);
      setNewWebhook("");
    }
  };

  const handleRemoveWebhook = (url: string) => {
    setWebhookUrls((prev) => prev.filter((u) => u !== url));
  };

  const totalRecipients = selectedChannelIds.length + webhookUrls.length;

  const filteredChannels = MOCK_CHANNELS.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex items-center gap-1.5">
      <button
        onClick={onViewPreview}
        className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
      >
        <Eye className="h-3.5 w-3.5" />
        Preview
      </button>

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
              <p className="mb-2 text-[11px] font-semibold text-foreground">Send preview to channel</p>

              <div className="relative mb-2">
                <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search channels..."
                  className="w-full rounded-lg border bg-background py-1.5 pl-8 pr-3 text-xs text-foreground outline-none placeholder:text-muted-foreground focus:ring-1 focus:ring-ring"
                />
              </div>

              <div className="max-h-40 space-y-0.5 overflow-y-auto">
                {filteredChannels.map((channel) => {
                  const selected = selectedChannelIds.includes(channel.id);
                  return (
                    <button
                      key={channel.id}
                      onClick={() => toggleChannel(channel.id)}
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
                      <Hash className="h-3 w-3 text-muted-foreground" />
                      <span className="truncate font-medium text-foreground">{channel.name}</span>
                    </button>
                  );
                })}
                {filteredChannels.length === 0 && (
                  <p className="px-2.5 py-3 text-center text-xs text-muted-foreground">No channels found</p>
                )}
              </div>
            </div>

            {/* Webhook URL section */}
            <div className="border-t px-3 py-2.5">
              {!showWebhook ? (
                <button
                  onClick={() => setShowWebhook(true)}
                  className="flex items-center gap-1 text-[11px] font-medium text-primary transition-colors hover:text-primary/80"
                >
                  <Link2 className="h-3 w-3" />
                  Add webhook URL
                </button>
              ) : (
                <div className="space-y-1.5">
                  <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                    Webhook URLs
                  </p>
                  {webhookUrls.map((url) => (
                    <div
                      key={url}
                      className="flex items-center justify-between rounded-md bg-secondary px-2 py-1"
                    >
                      <span className="text-xs text-foreground truncate max-w-[200px]">{url}</span>
                      <button
                        onClick={() => handleRemoveWebhook(url)}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                  <div className="flex gap-1.5">
                    <input
                      type="url"
                      value={newWebhook}
                      onChange={(e) => setNewWebhook(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddWebhook();
                        }
                      }}
                      placeholder="https://hooks.slack.com/..."
                      className="flex-1 rounded-md border bg-background px-2 py-1.5 text-xs text-foreground outline-none placeholder:text-muted-foreground focus:ring-1 focus:ring-ring"
                    />
                    <button
                      onClick={handleAddWebhook}
                      className="rounded-md bg-primary px-2.5 py-1.5 text-[11px] font-medium text-primary-foreground hover:opacity-90"
                    >
                      Add
                    </button>
                  </div>
                </div>
              )}
            </div>

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

export { SlackPreviewModal, SlackPreviewActions };
