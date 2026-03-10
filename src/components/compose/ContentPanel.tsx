import { useState } from "react";
import {
  X,
  List,
  Shuffle,
  SplitSquareHorizontal,
  ShieldCheck,
  ShieldPlus,
  ChevronDown,
  Link2,
  Settings2,
  Pencil,
  Check,
} from "lucide-react";
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

/* ─── Collapsible Settings Section ─── */
const SettingsSection = ({
  icon: Icon,
  title,
  summary,
  isActive,
  children,
  defaultOpen = false,
}: {
  icon: typeof Settings2;
  title: string;
  summary: string;
  isActive?: boolean;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) => {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-border last:border-b-0">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left transition-colors hover:bg-secondary/40"
      >
        <div
          className={cn(
            "flex h-6 w-6 shrink-0 items-center justify-center rounded-md",
            isActive ? "bg-primary/10" : "bg-secondary"
          )}
        >
          <Icon
            className={cn(
              "h-3 w-3",
              isActive ? "text-primary" : "text-muted-foreground"
            )}
          />
        </div>
        <div className="min-w-0 flex-1">
          <span className="block text-[11px] font-semibold text-foreground">{title}</span>
          <span className="block truncate text-[10px] text-muted-foreground">{summary}</span>
        </div>
        {isActive && (
          <div className="flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full bg-primary">
            <Check className="h-2 w-2 text-primary-foreground" />
          </div>
        )}
        <ChevronDown
          className={cn(
            "h-3 w-3 shrink-0 text-muted-foreground/50 transition-transform",
            open && "rotate-180"
          )}
        />
      </button>
      {open && (
        <div className="px-4 pb-3">
          {children}
        </div>
      )}
    </div>
  );
};

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

  const accessSummary = contentAccessMode === "available"
    ? "Send available content only"
    : "Grant access to all recipients";

  const distLabel = DIST_OPTIONS.find((o) => o.value === contentDistribution)?.label || "Keep order";
  const distSummary =
    contentDistribution === "randomize"
      ? "Content order shuffled per recipient"
      : contentDistribution === "split"
      ? "Each recipient gets one random item"
      : "Content sent in order shown";

  const utmActive = utmSharedParams.source || utmSharedParams.campaign || Object.keys(utmPerContentParams).some(k => utmPerContentParams[k]?.source);
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

      {/* Content cards — always visible at the top */}
      <div className="flex-1 overflow-y-auto min-h-0">
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

        {/* Settings — collapsible sections pinned below content */}
        {items.length >= 1 && (
          <div className="border-t">
            <div className="px-4 py-2">
              <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                Content Settings
              </span>
            </div>

            <SettingsSection
              icon={ShieldCheck}
              title="Recipient Access"
              summary={accessSummary}
              isActive={contentAccessMode === "grant-all"}
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
                <p className="mt-2 rounded-md bg-destructive/10 border border-destructive/20 px-2.5 py-1.5 text-[10px] leading-snug text-destructive-foreground">
                  <strong>Note:</strong> This will modify access permissions. Recipients who don't currently have access will be individually granted it.
                </p>
              )}
            </SettingsSection>

            {items.length >= 2 && (
              <SettingsSection
                icon={List}
                title="Distribution"
                summary={distSummary}
              >
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
                  {distSummary}
                </p>
              </SettingsSection>
            )}

            {linkContentIds.length > 0 && (
              <SettingsSection
                icon={Link2}
                title="UTM Parameters"
                summary={utmSummary}
                isActive={!!utmActive}
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
              </SettingsSection>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentPanel;
