import { useState } from "react";
import {
  X,
  List,
  Shuffle,
  SplitSquareHorizontal,
  ShieldCheck,
  ShieldPlus,
  Link2,
  Settings2,
  Pencil,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import ContentCard from "./ContentCard";
import type { ContentItem } from "@/types/content";
import type { ContentDistribution } from "./settings/ContentDistributionSettings";
import LinkTrackingSettings, {
  type TrackingConfig,
  type ContentTrackingOverride,
  EMPTY_TRACKING,
} from "./settings/LinkTrackingSettings";

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
  trackingConfig: TrackingConfig;
  onTrackingConfigChange: (c: TrackingConfig) => void;
  contentTrackingOverrides: Record<string, ContentTrackingOverride>;
  onContentTrackingOverrideChange: (contentId: string, o: ContentTrackingOverride) => void;
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
    description: "Each recipient only receives content they already have access to.",
    icon: ShieldCheck,
  },
  {
    value: "grant-all",
    label: "Grant access to all",
    description: "All recipients will be granted access to all selected content before sending.",
    icon: ShieldPlus,
  },
];

type ModalId = "access" | "distribution" | "utm" | null;

/* ─── Summary Row (same pattern as SendingDeliveryPanel) ─── */
const SummaryRow = ({
  icon: Icon,
  title,
  summary,
  detail,
  isActive,
  onEdit,
  isLast,
}: {
  icon: typeof Settings2;
  title: string;
  summary: string;
  detail?: string;
  isActive: boolean;
  onEdit: () => void;
  isLast?: boolean;
}) => (
  <div className={cn(!isLast && "border-b border-border")}>
    <button
      onClick={onEdit}
      className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-secondary/40"
    >
      <div
        className={cn(
          "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg",
          isActive ? "bg-primary/10" : "bg-secondary"
        )}
      >
        <Icon
          className={cn(
            "h-3.5 w-3.5",
            isActive ? "text-primary" : "text-muted-foreground"
          )}
        />
      </div>
      <div className="min-w-0 flex-1">
        <span className="block text-xs font-semibold text-foreground">{title}</span>
        <span className="block truncate text-[11px] text-muted-foreground">
          {summary}
        </span>
        {detail && (
          <span className="block truncate text-[10px] text-muted-foreground/70">
            {detail}
          </span>
        )}
      </div>
      {isActive && (
        <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-primary">
          <Check className="h-2.5 w-2.5 text-primary-foreground" />
        </div>
      )}
      <Pencil className="h-3 w-3 shrink-0 text-muted-foreground/50" />
    </button>
  </div>
);

/* ─── Edit Modal Shell ─── */
const EditModal = ({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) => (
  <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
    <DialogContent className="sm:max-w-md p-0">
      <DialogHeader className="border-b px-5 py-4">
        <DialogTitle className="text-sm font-semibold">{title}</DialogTitle>
      </DialogHeader>
      <div className="px-5 py-4">{children}</div>
      <div className="border-t px-5 py-3 flex justify-end">
        <Button size="sm" onClick={onClose} className="gap-1.5">
          Done
          <Check className="h-3 w-3" />
        </Button>
      </div>
    </DialogContent>
  </Dialog>
);

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
  const [activeModal, setActiveModal] = useState<ModalId>(null);

  if (!visible) return null;

  const linkItems = items.filter((i) => i.type === "link");
  const linkContentIds = linkItems.map((i) => i.id);
  const linkContentTitles = Object.fromEntries(linkItems.map((i) => [i.id, i.title]));

  // Summaries
  const accessSummary = contentAccessMode === "available"
    ? "Send available content only"
    : "Grant access to all recipients";

  const distLabel = DIST_OPTIONS.find((o) => o.value === contentDistribution)?.label || "Keep order";
  const distSummary =
    contentDistribution === "randomize"
      ? "Shuffle order per recipient"
      : contentDistribution === "split"
      ? "Each recipient gets one item"
      : "Content sent in current order";

  const utmActive = !!(utmSharedParams.source || utmSharedParams.campaign || Object.keys(utmPerContentParams).some(k => utmPerContentParams[k]?.source));
  const utmSummary = utmMode === "per-content"
    ? "Per-content UTM parameters"
    : utmSharedParams.source
    ? `source=${utmSharedParams.source}${utmSharedParams.campaign ? `, campaign=${utmSharedParams.campaign}` : ""}`
    : "No UTM parameters configured";

  return (
    <div className="w-[360px] shrink-0 border-l bg-card flex flex-col overflow-hidden">
      {/* Sticky header */}
      <div className="flex items-center justify-between border-b px-4 py-3 shrink-0">
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

      <div className="flex-1 overflow-y-auto min-h-0">
        {/* Settings summary rows — always visible at top */}
        {items.length >= 1 && (
          <div className="border-b">
            <SummaryRow
              icon={ShieldCheck}
              title="Recipient Access"
              summary={accessSummary}
              isActive={contentAccessMode === "grant-all"}
              onEdit={() => setActiveModal("access")}
            />
            {items.length >= 2 && (
              <SummaryRow
                icon={List}
                title="Distribution"
                summary={distSummary}
                isActive={contentDistribution !== "manual"}
                onEdit={() => setActiveModal("distribution")}
              />
            )}
            {linkContentIds.length > 0 && (
              <SummaryRow
                icon={Link2}
                title="UTM Parameters"
                summary={utmSummary}
                isActive={utmActive}
                onEdit={() => setActiveModal("utm")}
                isLast
              />
            )}
          </div>
        )}

        {/* Content cards */}
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
          {items.length === 0 && (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary mb-2">
                <Settings2 className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="text-xs text-muted-foreground">No content selected</p>
              <p className="text-[10px] text-muted-foreground/70 mt-0.5">Add content to configure delivery settings</p>
            </div>
          )}
        </div>
      </div>

      {/* ─── Edit Modals ─── */}
      <EditModal
        open={activeModal === "access"}
        onClose={() => setActiveModal(null)}
        title="Recipient Access"
      >
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
                <div className="min-w-0 flex-1">
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
          <p className="mt-3 rounded-md bg-destructive/10 border border-destructive/20 px-2.5 py-1.5 text-[10px] leading-snug text-destructive-foreground">
            <strong>Note:</strong> This will modify access permissions. Recipients who don't currently have access will be individually granted it.
          </p>
        )}
      </EditModal>

      <EditModal
        open={activeModal === "distribution"}
        onClose={() => setActiveModal(null)}
        title="Content Distribution"
      >
        <div className="space-y-1.5">
          {DIST_OPTIONS.map((opt) => {
            const Icon = opt.icon;
            const isSelected = contentDistribution === opt.value;
            const desc =
              opt.value === "manual"
                ? "Send content in the current order"
                : opt.value === "randomize"
                ? "Shuffle the order for each recipient"
                : "Each recipient gets one random content item";
            return (
              <button
                key={opt.value}
                onClick={() => onContentDistributionChange(opt.value)}
                className={cn(
                  "flex w-full items-center gap-2.5 rounded-lg border px-3 py-2.5 text-left transition-all",
                  isSelected
                    ? "border-primary/30 bg-primary/5"
                    : "border-transparent hover:bg-secondary/60"
                )}
              >
                <Icon
                  className={cn(
                    "h-3.5 w-3.5 shrink-0",
                    isSelected ? "text-primary" : "text-muted-foreground"
                  )}
                />
                <div className="min-w-0 flex-1">
                  <span
                    className={cn(
                      "block text-xs font-medium",
                      isSelected ? "text-foreground" : "text-muted-foreground"
                    )}
                  >
                    {opt.label}
                  </span>
                  <span className="mt-0.5 block text-[10px] leading-snug text-muted-foreground">
                    {desc}
                  </span>
                </div>
                <div
                  className={cn(
                    "ml-auto h-3.5 w-3.5 shrink-0 rounded-full border-2 transition-colors",
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
      </EditModal>

      <EditModal
        open={activeModal === "utm"}
        onClose={() => setActiveModal(null)}
        title="UTM Parameters"
      >
        <UTMSettings
          linkContentIds={linkContentIds}
          linkContentTitles={linkContentTitles}
          mode={utmMode}
          onModeChange={onUTMModeChange}
          sharedParams={utmSharedParams}
          onSharedParamsChange={onUTMSharedParamsChange}
          perContentParams={utmPerContentParams}
          onPerContentParamsChange={onUTMPerContentParamsChange}
          embedded
        />
      </EditModal>
    </div>
  );
};

export default ContentPanel;
