import { X, List, Shuffle, SplitSquareHorizontal, ShieldCheck, ShieldPlus } from "lucide-react";
import { cn } from "@/lib/utils";
import ContentCard from "./ContentCard";
import type { ContentItem } from "@/types/content";
import type { ContentDistribution } from "./settings/ContentDistributionSettings";
import UTMSettings, { type UTMMode, type UTMParams, EMPTY_UTM } from "./settings/UTMSettings";

export type ContentAccessMode = "available" | "grant-all";

interface ContentPanelProps {
  visible: boolean;
  onClose: () => void;
  items: ContentItem[];
  onRemove: (id: string) => void;
  onToggleNetwork: (contentId: string, networkId: string) => void;
  contentDistribution: ContentDistribution;
  onContentDistributionChange: (d: ContentDistribution) => void;
  contentAccessMode: ContentAccessMode;
  onContentAccessModeChange: (mode: ContentAccessMode) => void;
  utmMode: UTMMode;
  onUTMModeChange: (m: UTMMode) => void;
  utmSharedParams: UTMParams;
  onUTMSharedParamsChange: (p: UTMParams) => void;
  utmPerContentParams: Record<string, UTMParams>;
  onUTMPerContentParamsChange: (contentId: string, p: UTMParams) => void;
}

const DIST_OPTIONS: { value: ContentDistribution; label: string; icon: typeof List }[] = [
  { value: "manual", label: "Keep order", icon: List },
  { value: "randomize", label: "Randomize", icon: Shuffle },
  { value: "split", label: "Split send", icon: SplitSquareHorizontal },
];

const ACCESS_OPTIONS: { value: ContentAccessMode; label: string; description: string; icon: typeof ShieldCheck }[] = [
  {
    value: "available",
    label: "Send available",
    description: "Each recipient only receives content they already have access to. No access changes are made.",
    icon: ShieldCheck,
  },
  {
    value: "grant-all",
    label: "Grant access to all",
    description: "All recipients will be granted access to all selected content before sending.",
    icon: ShieldPlus,
  },
];

const ContentPanel = ({
  visible,
  onClose,
  items,
  onRemove,
  onToggleNetwork,
  contentDistribution,
  onContentDistributionChange,
  contentAccessMode,
  onContentAccessModeChange,
  utmMode,
  onUTMModeChange,
  utmSharedParams,
  onUTMSharedParamsChange,
  utmPerContentParams,
  onUTMPerContentParamsChange,
}: ContentPanelProps) => {
  if (!visible) return null;

  const linkItems = items.filter((i) => i.type === "link");
  const linkContentIds = linkItems.map((i) => i.id);
  const linkContentTitles = Object.fromEntries(linkItems.map((i) => [i.id, i.title]));

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

      {/* Content Access Mode - shown when 1+ items */}
      {items.length >= 1 && (
        <div className="border-b px-4 py-3">
          <label className="mb-2 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Recipient Access
          </label>
          <div className="space-y-1.5">
            {ACCESS_OPTIONS.map((opt) => {
              const Icon = opt.icon;
              const isSelected = contentAccessMode === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => onContentAccessModeChange(opt.value)}
                  className={cn(
                    "flex w-full items-start gap-2.5 rounded-lg border px-3 py-2.5 text-left transition-all",
                    isSelected
                      ? "border-primary/30 bg-primary/5"
                      : "border-transparent hover:bg-secondary/60"
                  )}
                >
                  <Icon
                    className={cn(
                      "mt-0.5 h-3.5 w-3.5 shrink-0",
                      isSelected ? "text-primary" : "text-muted-foreground"
                    )}
                  />
                  <div className="min-w-0">
                    <span
                      className={cn(
                        "block text-xs font-medium",
                        isSelected ? "text-foreground" : "text-muted-foreground"
                      )}
                    >
                      {opt.label}
                    </span>
                    <span className="mt-0.5 block text-[10px] leading-snug text-muted-foreground">
                      {opt.description}
                    </span>
                  </div>
                  <div
                    className={cn(
                      "ml-auto mt-0.5 h-3.5 w-3.5 shrink-0 rounded-full border-2 transition-colors",
                      isSelected
                        ? "border-primary bg-primary"
                        : "border-muted-foreground/30"
                    )}
                  >
                    {isSelected && (
                      <div className="flex h-full w-full items-center justify-center">
                        <div className="h-1 w-1 rounded-full bg-primary-foreground" />
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
          {contentAccessMode === "grant-all" && (
            <p className="mt-2 rounded-md bg-amber-50 border border-amber-200 px-2.5 py-1.5 text-[10px] leading-snug text-amber-900">
              <strong>Note:</strong> This will modify access permissions on the selected content items. Recipients who don't currently have access will be individually granted it.
            </p>
          )}
        </div>
      )}

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

      {/* UTM Parameters - shown when link content exists */}
      {linkContentIds.length > 0 && (
        <UTMSettings
          linkContentIds={linkContentIds}
          linkContentTitles={linkContentTitles}
          mode={utmMode}
          onModeChange={onUTMModeChange}
          sharedParams={utmSharedParams}
          onSharedParamsChange={onUTMSharedParamsChange}
          perContentParams={utmPerContentParams}
          onPerContentParamsChange={onUTMPerContentParamsChange}
        />
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
