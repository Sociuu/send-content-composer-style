import { X, List, Shuffle, SplitSquareHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import ContentCard from "./ContentCard";
import type { ContentItem } from "@/types/content";
import type { ContentDistribution } from "./settings/ContentDistributionSettings";

interface ContentPanelProps {
  visible: boolean;
  onClose: () => void;
  items: ContentItem[];
  onRemove: (id: string) => void;
  onToggleNetwork: (contentId: string, networkId: string) => void;
  contentDistribution: ContentDistribution;
  onContentDistributionChange: (d: ContentDistribution) => void;
}

const DIST_OPTIONS: { value: ContentDistribution; label: string; icon: typeof List }[] = [
  { value: "manual", label: "Keep order", icon: List },
  { value: "randomize", label: "Randomize", icon: Shuffle },
  { value: "split", label: "Split send", icon: SplitSquareHorizontal },
];

const ContentPanel = ({
  visible,
  onClose,
  items,
  onRemove,
  onToggleNetwork,
  contentDistribution,
  onContentDistributionChange,
}: ContentPanelProps) => {
  if (!visible) return null;

  return (
    <div className="w-[360px] shrink-0 border-l bg-card overflow-y-auto">
      <div className="flex items-center justify-between border-b px-4 py-3 sticky top-0 bg-card z-10">
        <h3 className="text-xs font-semibold text-foreground">
          Selected Content
          <span className="ml-1.5 font-normal text-muted-foreground">
            {items.length}
          </span>
        </h3>
        <button
          onClick={onClose}
          className="flex h-6 w-6 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Content Distribution - shown when 2+ items */}
      {items.length >= 2 && (
        <div className="border-b px-4 py-3">
          <label className="mb-2 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Distribution
          </label>
          <div className="flex gap-1 rounded-lg bg-secondary p-0.5">
            {DIST_OPTIONS.map((opt) => {
              const Icon = opt.icon;
              return (
                <button
                  key={opt.value}
                  onClick={() => onContentDistributionChange(opt.value)}
                  className={cn(
                    "flex flex-1 items-center justify-center gap-1 rounded-md px-2 py-1.5 text-[11px] font-medium transition-all",
                    contentDistribution === opt.value
                      ? "bg-card text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Icon className="h-3 w-3" />
                  {opt.label}
                </button>
              );
            })}
          </div>
          <p className="mt-1.5 text-[10px] text-muted-foreground">
            {contentDistribution === "randomize"
              ? "Content order is shuffled per recipient"
              : contentDistribution === "split"
              ? "Each recipient receives one random content item"
              : "Content is sent in the order shown below"}
          </p>
        </div>
      )}

      <div className="p-3 space-y-3">
        {items.map((item) => (
          <ContentCard
            key={item.id}
            item={item}
            compact
            onRemove={onRemove}
            onToggleNetwork={onToggleNetwork}
          />
        ))}
      </div>
    </div>
  );
};

export default ContentPanel;
