import { useState } from "react";
import { Reply, Plus, X, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface ReplyToFieldsProps {
  replyToName: string;
  onReplyToNameChange: (v: string) => void;
  replyToEmail: string;
  onReplyToEmailChange: (v: string) => void;
}

const ReplyToFields = ({
  replyToName,
  onReplyToNameChange,
  replyToEmail,
  onReplyToEmailChange,
}: ReplyToFieldsProps) => {
  const [visible, setVisible] = useState(false);
  const hasValues = replyToName.trim() || replyToEmail.trim();

  if (!visible && !hasValues) {
    return (
      <div className="border-b px-0 py-2">
        <button
          onClick={() => setVisible(true)}
          className="flex items-center gap-1.5 rounded-md px-1 py-1 text-[11px] font-medium text-muted-foreground transition-colors hover:text-primary hover:bg-primary/5"
        >
          <Plus className="h-3 w-3" />
          Add reply-to address
        </button>
      </div>
    );
  }

  return (
    <div className="border-b px-0 py-3">
      <div className="flex items-center justify-between mb-2">
        <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
          <Reply className="h-3.5 w-3.5" />
          Reply-to
        </span>
        <button
          onClick={() => {
            if (hasValues) {
              setVisible(!visible);
            } else {
              setVisible(false);
            }
          }}
          className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground transition-colors"
        >
          {!hasValues && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setVisible(false);
                onReplyToNameChange("");
                onReplyToEmailChange("");
              }}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </button>
        {(visible || hasValues) && (
          <button
            onClick={() => {
              setVisible(false);
              onReplyToNameChange("");
              onReplyToEmailChange("");
            }}
            className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-destructive transition-colors"
            title="Remove reply-to"
          >
            <X className="h-3 w-3" />
            Remove
          </button>
        )}
      </div>
      <div className="flex gap-2">
        <div className="flex-1">
          <input
            type="text"
            value={replyToName}
            onChange={(e) => onReplyToNameChange(e.target.value)}
            placeholder="Reply-to name"
            className="w-full rounded-md border bg-background px-2.5 py-1.5 text-xs text-foreground outline-none placeholder:text-muted-foreground focus:ring-1 focus:ring-ring"
          />
        </div>
        <div className="flex-1">
          <input
            type="email"
            value={replyToEmail}
            onChange={(e) => onReplyToEmailChange(e.target.value)}
            placeholder="Reply-to email"
            className="w-full rounded-md border bg-background px-2.5 py-1.5 text-xs text-foreground outline-none placeholder:text-muted-foreground focus:ring-1 focus:ring-ring"
          />
        </div>
      </div>
    </div>
  );
};

export default ReplyToFields;
