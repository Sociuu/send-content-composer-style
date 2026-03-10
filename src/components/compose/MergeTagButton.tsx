import { useState } from "react";
import { ChevronDown, Tag } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export interface MergeTag {
  label: string;
  value: string;
  group: string;
}

export const MERGE_TAGS: MergeTag[] = [
  { label: "First Name", value: "{{employee.first_name}}", group: "Employee" },
  { label: "Last Name", value: "{{employee.last_name}}", group: "Employee" },
  { label: "Email", value: "{{employee.email}}", group: "Employee" },
  { label: "Department", value: "{{employee.department}}", group: "Employee" },
  { label: "Logo", value: "{{client.logo}}", group: "Client" },
  { label: "Domain", value: "{{client.domain}}", group: "Client" },
  { label: "Unsubscribe Link", value: "{{unsubscribe_link}}", group: "Links" },
  { label: "MyHub Link", value: "{{myhub_link}}", group: "Links" },
];

const GROUPS = ["Employee", "Client", "Links"];

interface MergeTagButtonProps {
  onInsert: (tag: string) => void;
  compact?: boolean;
}

const MergeTagButton = ({ onInsert, compact }: MergeTagButtonProps) => {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            "flex shrink-0 items-center gap-1 rounded-md border border-dashed border-muted-foreground/30 px-2 py-0.5 text-[10px] font-medium text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary",
            compact && "px-1.5"
          )}
        >
          <Tag className="h-2.5 w-2.5" />
          <span>{compact ? "Tags" : "Merge Tags"}</span>
          <ChevronDown className="h-2.5 w-2.5" />
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-52 p-0" sideOffset={4}>
        <div className="max-h-64 overflow-y-auto py-1">
          {GROUPS.map((group) => (
            <div key={group}>
              <p className="px-3 py-1 text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">
                {group}
              </p>
              {MERGE_TAGS.filter((t) => t.group === group).map((tag) => (
                <button
                  key={tag.value}
                  onClick={() => {
                    onInsert(tag.value);
                    setOpen(false);
                  }}
                  className="flex w-full items-center justify-between px-3 py-1.5 text-left text-[11px] transition-colors hover:bg-secondary"
                >
                  <span className="text-foreground">{tag.label}</span>
                  <span className="font-mono text-[9px] text-muted-foreground">
                    {tag.value}
                  </span>
                </button>
              ))}
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default MergeTagButton;
