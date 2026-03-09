import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { X } from "lucide-react";
import type { ContentItem } from "@/types/content";

interface EmailPreviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  subject: string;
  body: string;
  footer: string;
  contentItems: ContentItem[];
}

const EmailPreviewModal = ({
  open,
  onOpenChange,
  subject,
  body,
  footer,
  contentItems,
}: EmailPreviewModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-hidden p-0 sm:max-w-3xl">
        <DialogHeader className="sr-only">
          <DialogTitle>Email Preview</DialogTitle>
        </DialogHeader>

        {/* Simulated email chrome */}
        <div className="flex items-center justify-between border-b bg-muted/50 px-5 py-3">
          <span className="text-xs font-semibold text-foreground">Email Preview</span>
          <button
            onClick={() => onOpenChange(false)}
            className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="overflow-y-auto" style={{ maxHeight: "calc(90vh - 52px)" }}>
          {/* Email body rendered */}
          <div className="bg-muted/30 px-4 py-6">
            <div className="mx-auto max-w-md rounded-lg border bg-card shadow-sm">
              {/* Logo */}
              <div className="border-b px-6 py-5">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
                    S
                  </div>
                  <span className="text-sm font-semibold text-foreground">Sociuu</span>
                </div>
              </div>

              {/* Subject */}
              {subject && (
                <div className="border-b px-6 py-3">
                  <h2 className="text-base font-semibold text-foreground">{subject}</h2>
                </div>
              )}

              {/* Body */}
              <div className="px-6 py-5">
                {body ? (
                  <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">
                    {body}
                  </p>
                ) : (
                  <p className="text-sm italic text-muted-foreground">No body text yet...</p>
                )}
              </div>

              {/* Content items */}
              {contentItems.length > 0 && (
                <div className="space-y-3 border-t px-6 py-5">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Shared Content
                  </p>
                  {contentItems.map((item) => (
                    <div key={item.id} className="flex gap-3 rounded-lg border bg-background p-3">
                      {item.thumbnail && (
                        <img
                          src={item.thumbnail}
                          alt={item.title}
                          className="h-14 w-14 shrink-0 rounded-md object-cover"
                        />
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold text-foreground">{item.title}</p>
                        <p className="mt-0.5 line-clamp-2 text-[11px] leading-relaxed text-muted-foreground">
                          {item.text}
                        </p>
                        {item.linkDomain && (
                          <p className="mt-1 text-[10px] text-primary">{item.linkDomain}</p>
                        )}
                        <div className="mt-1.5 flex gap-1">
                          {item.networks
                            .filter((n) => n.enabled)
                            .map((n) => (
                              <span
                                key={n.id}
                                className="rounded bg-secondary px-1.5 py-0.5 text-[9px] font-medium text-muted-foreground"
                              >
                                {n.name}
                              </span>
                            ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Footer */}
              {footer && (
                <div className="border-t px-6 py-4">
                  <p className="whitespace-pre-wrap text-xs leading-relaxed text-muted-foreground">
                    {footer}
                  </p>
                </div>
              )}

              {/* Unsubscribe (non-editable) */}
              <div className="border-t bg-muted/30 px-6 py-4 text-center">
                <p className="text-[10px] leading-relaxed text-muted-foreground">
                  You are receiving this because you are a member of the advocacy program.
                  <br />
                  <span className="cursor-pointer text-primary underline">Unsubscribe</span>
                  {" · "}
                  <span className="cursor-pointer text-primary underline">Manage preferences</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EmailPreviewModal;
