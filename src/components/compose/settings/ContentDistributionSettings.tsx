import { cn } from "@/lib/utils";
import { List, Shuffle, SplitSquareHorizontal } from "lucide-react";

export type ContentDistribution = "manual" | "randomize" | "split";

interface ContentDistributionSettingsProps {
  distribution: ContentDistribution;
  onDistributionChange: (d: ContentDistribution) => void;
  contentCount: number;
}

const OPTIONS: { value: ContentDistribution; label: string; desc: string; icon: typeof List }[] = [
  {
    value: "manual",
    label: "Keep order",
    desc: "Send content in the current order",
    icon: List,
  },
  {
    value: "randomize",
    label: "Randomize",
    desc: "Shuffle the order for each recipient",
    icon: Shuffle,
  },
  {
    value: "split",
    label: "Split send",
    desc: "Each recipient gets one random content item",
    icon: SplitSquareHorizontal,
  },
];

const ContentDistributionSettings = ({
  distribution,
  onDistributionChange,
  contentCount,
}: ContentDistributionSettingsProps) => {
  if (contentCount < 2) return null;

  return (
    <div className="space-y-3">
      <label className="block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        Content Distribution
      </label>
      <div className="space-y-1.5">
        {OPTIONS.map((opt) => {
          const Icon = opt.icon;
          return (
            <button
              key={opt.value}
              onClick={() => onDistributionChange(opt.value)}
              className={cn(
                "flex w-full items-center gap-2.5 rounded-lg border p-2.5 text-left transition-all",
                distribution === opt.value
                  ? "border-primary/30 bg-primary/5"
                  : "hover:bg-secondary/50"
              )}
            >
              <Icon className={cn(
                "h-3.5 w-3.5 shrink-0",
                distribution === opt.value ? "text-primary" : "text-muted-foreground"
              )} />
              <div>
                <span className={cn(
                  "text-xs font-medium",
                  distribution === opt.value ? "text-foreground" : "text-foreground"
                )}>
                  {opt.label}
                </span>
                <p className="text-[11px] text-muted-foreground">{opt.desc}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ContentDistributionSettings;
