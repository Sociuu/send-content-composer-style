import { useState, useRef } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface MergeTag {
  label: string;
  value: string;
}

export const MERGE_TAGS: MergeTag[] = [
  { label: "Employee First Name", value: "{{employee.first_name}}" },
  { label: "Employee Last Name", value: "{{employee.last_name}}" },
  { label: "Employee Email", value: "{{employee.email}}" },
  { label: "Employee Department", value: "{{employee.department}}" },
  { label: "Client Logo", value: "{{client.logo}}" },
  { label: "Client Domain", value: "{{client.domain}}" },
  { label: "Unsubscribe Link", value: "{{unsubscribe_link}}" },
  { label: "MyHub Link", value: "{{myhub_link}}" },
];

interface MergeTagButtonProps {
  onInsert: (tag: string) => void;
  compact?: boolean;
}

const MergeTagButton = ({ onInsert, compact }: MergeTagButtonProps) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useState(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  });

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={cn(
          "flex shrink-0 items-center gap-1 rounded-md border border-dashed border-muted-foreground/30 px-2 py-0.5 text-[10px] font-medium text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary",
          compact && "px-1.5"
        )}
      >
        <span className="font-mono text-[10px]">{"{}"}</span>
        {!compact && <span>Merge</span>}
        <ChevronDown className="h-2.5 w-2.5" />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full z-50 mt-1 w-52 rounded-lg border bg-card py-1 shadow-lg">
            <p className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Insert merge tag
            </p>
            {MERGE_TAGS.map((tag) => (
              <button
                key={tag.value}
                onClick={() => {
                  onInsert(tag.value);
                  setOpen(false);
                }}
                className="flex w-full items-center justify-between px-3 py-1.5 text-left text-xs transition-colors hover:bg-secondary"
              >
                <span className="text-foreground">{tag.label}</span>
                <span className="font-mono text-[10px] text-muted-foreground">{tag.value}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default MergeTagButton;
