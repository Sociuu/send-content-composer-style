import { useState, useRef, useEffect } from "react";
import { ArrowLeft, Clock, Pencil } from "lucide-react";
import { cn } from "@/lib/utils";

interface ComposeHeaderProps {
  draftStatus?: string;
  onBack?: () => void;
  title: string;
  onTitleChange: (title: string) => void;
}

const ComposeHeader = ({
  draftStatus = "Draft",
  onBack,
  title,
  onTitleChange,
}: ComposeHeaderProps) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [editing]);

  const finishEditing = () => {
    setEditing(false);
    if (!title.trim()) {
      onTitleChange(generateDefaultTitle());
    }
  };

  return (
    <header className="flex items-center justify-between border-b px-6 py-3">
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div className="min-w-0">
          {editing ? (
            <input
              ref={inputRef}
              value={title}
              onChange={(e) => onTitleChange(e.target.value)}
              onBlur={finishEditing}
              onKeyDown={(e) => {
                if (e.key === "Enter") finishEditing();
                if (e.key === "Escape") {
                  setEditing(false);
                }
              }}
              maxLength={120}
              className="h-6 w-64 rounded border bg-background px-1.5 text-sm font-semibold text-foreground outline-none focus:ring-1 focus:ring-ring"
            />
          ) : (
            <button
              onClick={() => setEditing(true)}
              className="group flex items-center gap-1.5 rounded px-1 py-0.5 -mx-1 transition-colors hover:bg-secondary"
            >
              <h1 className="text-sm font-semibold text-foreground truncate max-w-[300px]">
                {title}
              </h1>
              <Pencil className="h-3 w-3 shrink-0 text-muted-foreground/40 group-hover:text-muted-foreground" />
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Clock className="h-3 w-3" />
        <span>{draftStatus}</span>
      </div>
    </header>
  );
};

export function generateDefaultTitle(): string {
  const now = new Date();
  const date = now.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  const time = now.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
  return `Message ${date} ${time}`;
}

export default ComposeHeader;
