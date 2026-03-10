import { useState, useRef, useMemo } from "react";
import { cn } from "@/lib/utils";
import {
  Link2,
  ChevronDown,
  ChevronRight,
  Plus,
  Trash2,
  ExternalLink,
  Ban,
  RotateCcw,
  Tag,
  AlertTriangle,
  X,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

/* ─── Types ─── */

export interface TrackingParam {
  key: string;
  value: string;
}

export interface TrackingConfig {
  params: TrackingParam[];
}

export type ContentTrackingMode = "inherit" | "override" | "exclude";

export interface ContentTrackingOverride {
  mode: ContentTrackingMode;
  config?: TrackingConfig;
}

const DEFAULT_PARAMS: TrackingParam[] = [
  { key: "utm_source", value: "" },
  { key: "utm_medium", value: "" },
  { key: "utm_campaign", value: "" },
];

export const EMPTY_TRACKING: TrackingConfig = { params: [] };
export const DEFAULT_TRACKING: TrackingConfig = { params: [...DEFAULT_PARAMS.map(p => ({ ...p }))] };

/* ─── UTM Helpers ─── */

const REQUIRED_UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign"];
const OPTIONAL_UTM_KEYS = ["utm_term", "utm_content"];
const ALL_UTM_KEYS = [...REQUIRED_UTM_KEYS, ...OPTIONAL_UTM_KEYS];

const UTM_LABELS: Record<string, string> = {
  utm_source: "Source (required)",
  utm_medium: "Medium (required)",
  utm_campaign: "Campaign (required)",
  utm_term: "Term",
  utm_content: "Content",
};

/* ─── Key/Value validation helpers ─── */

const MAX_KEY_LENGTH = 128;
const MAX_VALUE_LENGTH = 512;

function sanitizeKey(raw: string): string {
  return raw
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9_\-.]/g, "")
    .slice(0, MAX_KEY_LENGTH);
}

/** Clean params: discard any without a key */
export function cleanTrackingParams(config: TrackingConfig): TrackingConfig {
  return { params: config.params.filter((p) => p.key.trim() !== "") };
}

function getUtmWarning(params: TrackingParam[]): string | null {
  const utmKeys = params.map((p) => p.key).filter((k) => k.startsWith("utm_"));
  if (utmKeys.length === 0) return null;
  const missing = REQUIRED_UTM_KEYS.filter((k) => !utmKeys.includes(k));
  if (missing.length === 0) return null;
  const names = missing.map((k) => k.replace("utm_", "")).join(", ");
  return `UTM tracking requires ${names}. Without ${missing.length > 1 ? "these" : "it"}, analytics tools like Google Analytics won't process your UTM tags.`;
}

/* ─── Merge tags ─── */

const TRACKING_MERGE_TAGS = [
  { tag: "{{content_id}}", label: "Content ID", group: "Content" },
  { tag: "{{content_title}}", label: "Content Title", group: "Content" },
  { tag: "{{network_name}}", label: "Network", group: "Content" },
  { tag: "{{recipient_id}}", label: "Recipient ID", group: "Recipient" },
  { tag: "{{recipient_email}}", label: "Email", group: "Recipient" },
  { tag: "{{recipient_first_name}}", label: "First Name", group: "Recipient" },
  { tag: "{{recipient_last_name}}", label: "Last Name", group: "Recipient" },
  { tag: "{{send_date}}", label: "Send Date", group: "System" },
  { tag: "{{message_id}}", label: "Message ID", group: "System" },
];

/* ─── Merge Tag Popover ─── */

const MergeTagPopover = ({ onInsert }: { onInsert: (tag: string) => void }) => {
  const [open, setOpen] = useState(false);
  const groups = Array.from(new Set(TRACKING_MERGE_TAGS.map((t) => t.group)));

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="flex items-center gap-0.5 rounded px-1 py-0.5 text-[9px] font-medium text-primary/70 transition-colors hover:bg-primary/10 hover:text-primary"
          title="Insert dynamic value"
        >
          <Tag className="h-2.5 w-2.5" />
          <span>Merge tag</span>
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-52 p-0" sideOffset={4}>
        <div className="max-h-56 overflow-y-auto py-1">
          {groups.map((group) => (
            <div key={group}>
              <p className="px-3 py-1 text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">
                {group}
              </p>
              {TRACKING_MERGE_TAGS.filter((t) => t.group === group).map((tag) => (
                <button
                  key={tag.tag}
                  onClick={() => {
                    onInsert(tag.tag);
                    setOpen(false);
                  }}
                  className="flex w-full items-center justify-between px-3 py-1.5 text-left text-[11px] transition-colors hover:bg-secondary"
                >
                  <span className="text-foreground">{tag.label}</span>
                  <span className="font-mono text-[9px] text-muted-foreground">{tag.tag}</span>
                </button>
              ))}
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

/* ─── Add Parameter Popover (suggests missing UTM keys) ─── */

const AddParamPopover = ({
  existingKeys,
  onAdd,
}: {
  existingKeys: string[];
  onAdd: (key: string) => void;
}) => {
  const [open, setOpen] = useState(false);
  const missingRequired = REQUIRED_UTM_KEYS.filter((k) => !existingKeys.includes(k));
  const missingOptional = OPTIONAL_UTM_KEYS.filter((k) => !existingKeys.includes(k));
  const hasSuggestions = missingRequired.length > 0 || missingOptional.length > 0;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button className="flex items-center gap-1 rounded-md px-2 py-1.5 text-[11px] font-medium text-primary/80 transition-colors hover:bg-primary/5 hover:text-primary">
          <Plus className="h-3 w-3" />
          Add parameter
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-56 p-0" sideOffset={4}>
        <div className="py-1">
          {hasSuggestions && (
            <>
              <p className="px-3 py-1 text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">
                UTM tags
              </p>
              {missingRequired.map((key) => (
                <button
                  key={key}
                  onClick={() => {
                    onAdd(key);
                    setOpen(false);
                  }}
                  className="flex w-full items-center justify-between px-3 py-1.5 text-left text-[11px] transition-colors hover:bg-secondary"
                >
                  <span className="text-foreground">{key}</span>
                  <span className="rounded-full bg-warning/10 px-1.5 py-0.5 text-[8px] font-semibold text-warning-foreground">
                    Required
                  </span>
                </button>
              ))}
              {missingOptional.map((key) => (
                <button
                  key={key}
                  onClick={() => {
                    onAdd(key);
                    setOpen(false);
                  }}
                  className="flex w-full items-center justify-between px-3 py-1.5 text-left text-[11px] transition-colors hover:bg-secondary"
                >
                  <span className="text-foreground">{key}</span>
                  <span className="text-[9px] text-muted-foreground">Optional</span>
                </button>
              ))}
              <div className="my-1 border-t" />
            </>
          )}
          <button
            onClick={() => {
              onAdd("");
              setOpen(false);
            }}
            className="flex w-full items-center gap-1.5 px-3 py-1.5 text-left text-[11px] text-foreground transition-colors hover:bg-secondary"
          >
            <Plus className="h-3 w-3 text-muted-foreground" />
            Custom parameter
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

/* ─── Single Param Row ─── */

const ParamRow = ({
  param,
  onChange,
  onRemove,
  isUtmKey,
}: {
  param: TrackingParam;
  onChange: (p: TrackingParam) => void;
  onRemove: () => void;
  isUtmKey: boolean;
}) => {
  const valRef = useRef<HTMLInputElement>(null);

  const insertTag = (tag: string) => {
    const el = valRef.current;
    if (!el) return;
    const start = el.selectionStart ?? param.value.length;
    const end = el.selectionEnd ?? param.value.length;
    const newVal = param.value.slice(0, start) + tag + param.value.slice(end);
    onChange({ ...param, value: newVal });
    setTimeout(() => {
      el.setSelectionRange(start + tag.length, start + tag.length);
      el.focus();
    }, 0);
  };

  const isRequired = REQUIRED_UTM_KEYS.includes(param.key);

  return (
    <div className="group rounded-lg border bg-background p-2.5 transition-colors hover:border-border">
      <div className="flex items-center gap-1.5 mb-1.5">
        {isUtmKey ? (
          <div className="flex items-center gap-1.5 flex-1 min-w-0">
            <span className="text-[11px] font-medium text-foreground">{param.key}</span>
            {isRequired && (
              <span className="rounded bg-warning/10 px-1 py-0.5 text-[8px] font-semibold text-warning-foreground shrink-0">
                Required
              </span>
            )}
          </div>
        ) : (
          <input
            type="text"
            value={param.key}
            onChange={(e) => onChange({ ...param, key: sanitizeKey(e.target.value) })}
            placeholder="parameter-name"
            maxLength={MAX_KEY_LENGTH}
            className="h-6 flex-1 rounded border-none bg-transparent px-0 text-[11px] font-medium text-foreground outline-none placeholder:text-muted-foreground/40"
          />
        )}
        <MergeTagPopover onInsert={insertTag} />
        <button
          onClick={onRemove}
          className="flex h-5 w-5 shrink-0 items-center justify-center rounded text-muted-foreground/40 transition-colors hover:bg-destructive/10 hover:text-destructive opacity-0 group-hover:opacity-100"
          title="Remove parameter"
        >
          <Trash2 className="h-2.5 w-2.5" />
        </button>
      </div>
      <input
        ref={valRef}
        type="text"
        value={param.value}
        onChange={(e) => onChange({ ...param, value: e.target.value })}
        placeholder={isUtmKey ? `e.g. ${param.key === "utm_source" ? "employee_advocacy" : param.key === "utm_medium" ? "{{network_name}}" : param.key === "utm_campaign" ? "q1_brand_2026" : param.key === "utm_term" ? "{{recipient_id}}" : "{{content_id}}"}` : "value"}
        maxLength={MAX_VALUE_LENGTH}
        className="h-7 w-full rounded-md border bg-secondary/40 px-2 text-xs text-foreground outline-none focus:ring-1 focus:ring-ring placeholder:text-muted-foreground/40"
      />
    </div>
  );
};

/* ─── Tracking Form ─── */

const TrackingForm = ({
  config,
  onChange,
  showWarning = true,
}: {
  config: TrackingConfig;
  onChange: (c: TrackingConfig) => void;
  showWarning?: boolean;
}) => {
  const existingKeys = config.params.map((p) => p.key);
  const warning = showWarning !== false ? getUtmWarning(config.params) : null;

  const addParam = (key: string) => {
    onChange({ params: [...config.params, { key, value: "" }] });
  };

  const updateParam = (index: number, param: TrackingParam) => {
    const next = [...config.params];
    next[index] = param;
    onChange({ params: next });
  };

  const removeParam = (index: number) => {
    onChange({ params: config.params.filter((_, i) => i !== index) });
  };

  const resetToDefault = () => {
    onChange({ params: DEFAULT_PARAMS.map((p) => ({ ...p })) });
  };

  const clearAll = () => {
    onChange({ params: [] });
  };

  return (
    <div className="space-y-2">
      {/* Param list */}
      {config.params.length > 0 ? (
        <div className="space-y-1.5">
          {config.params.map((param, i) => (
            <ParamRow
              key={i}
              param={param}
              onChange={(p) => updateParam(i, p)}
              onRemove={() => removeParam(i)}
              isUtmKey={ALL_UTM_KEYS.includes(param.key)}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed bg-secondary/20 py-5 text-center">
          <p className="text-[11px] text-muted-foreground">No tracking parameters</p>
          <p className="text-[10px] text-muted-foreground/60 mt-0.5">
            Add parameters to track where your clicks come from
          </p>
        </div>
      )}

      {/* Warning banner */}
      {warning && (
        <div className="flex items-start gap-2 rounded-lg border border-warning/20 bg-warning/5 px-3 py-2">
          <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-warning mt-0.5" />
          <p className="text-[10px] leading-snug text-warning-foreground">
            {warning}
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between">
        <AddParamPopover existingKeys={existingKeys} onAdd={addParam} />
        <div className="flex items-center gap-1">
          {config.params.length > 0 && (
            <button
              onClick={clearAll}
              className="rounded px-2 py-1 text-[10px] font-medium text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
            >
              Clear all
            </button>
          )}
          <button
            onClick={resetToDefault}
            className="rounded px-2 py-1 text-[10px] font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            Reset defaults
          </button>
        </div>
      </div>
    </div>
  );
};

/* ─── Per-Content Row ─── */

const ContentOverrideRow = ({
  contentId,
  title,
  override,
  onChange,
}: {
  contentId: string;
  title: string;
  override: ContentTrackingOverride;
  onChange: (o: ContentTrackingOverride) => void;
}) => {
  const [expanded, setExpanded] = useState(false);
  const mode = override.mode;

  return (
    <div className="rounded-lg border bg-secondary/30">
      <div className="flex items-center gap-2 px-3 py-2">
        <Link2 className="h-3 w-3 shrink-0 text-muted-foreground" />
        <span className="flex-1 truncate text-[11px] font-medium text-foreground">
          {title}
        </span>

        <div className="flex items-center gap-0.5">
          {mode === "inherit" && (
            <span className="rounded-full bg-secondary px-1.5 py-0.5 text-[9px] font-medium text-muted-foreground">
              Global
            </span>
          )}
          {mode === "exclude" && (
            <span className="rounded-full bg-destructive/10 px-1.5 py-0.5 text-[9px] font-medium text-destructive">
              Excluded
            </span>
          )}
          {mode === "override" && (
            <span className="rounded-full bg-primary/10 px-1.5 py-0.5 text-[9px] font-medium text-primary">
              Custom
            </span>
          )}
        </div>

        <div className="flex items-center gap-0.5">
          {mode !== "exclude" ? (
            <>
              <button
                onClick={() => onChange({ mode: "exclude" })}
                className="rounded p-1 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                title="Exclude from tracking"
              >
                <Ban className="h-3 w-3" />
              </button>
              <button
                onClick={() => {
                  if (mode === "override") {
                    onChange({ mode: "inherit" });
                    setExpanded(false);
                  } else {
                    onChange({
                      mode: "override",
                      config: override.config || { params: DEFAULT_PARAMS.map((p) => ({ ...p })) },
                    });
                    setExpanded(true);
                  }
                }}
                className={cn(
                  "rounded p-1 transition-colors",
                  mode === "override"
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
                title={mode === "override" ? "Use global settings" : "Set custom values"}
              >
                {mode === "override" ? (
                  <ChevronDown className="h-3 w-3" />
                ) : (
                  <ChevronRight className="h-3 w-3" />
                )}
              </button>
            </>
          ) : (
            <button
              onClick={() => onChange({ mode: "inherit" })}
              className="rounded p-1 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              title="Re-enable tracking"
            >
              <RotateCcw className="h-3 w-3" />
            </button>
          )}
        </div>
      </div>

      {mode === "override" && expanded && (
        <div className="border-t px-3 py-2.5">
          <TrackingForm
            config={override.config || EMPTY_TRACKING}
            onChange={(c) => onChange({ mode: "override", config: c })}
          />
        </div>
      )}
    </div>
  );
};

/* ─── Main Component ─── */

export interface LinkTrackingSettingsProps {
  linkContentIds: string[];
  linkContentTitles: Record<string, string>;
  globalConfig: TrackingConfig;
  onGlobalConfigChange: (c: TrackingConfig) => void;
  contentOverrides: Record<string, ContentTrackingOverride>;
  onContentOverrideChange: (contentId: string, o: ContentTrackingOverride) => void;
  embedded?: boolean;
}

const LinkTrackingSettings = ({
  linkContentIds,
  linkContentTitles,
  globalConfig,
  onGlobalConfigChange,
  contentOverrides,
  onContentOverrideChange,
  embedded = false,
}: LinkTrackingSettingsProps) => {
  if (linkContentIds.length === 0) return null;

  return (
    <div>
      {/* Help text */}
      <div className="mb-3 rounded-lg bg-secondary/60 px-3 py-2">
        <p className="text-[11px] leading-snug text-muted-foreground">
          Add tracking tags to your links so you can measure where clicks come from
          in tools like Google Analytics. Tags are appended as URL parameters.
        </p>
        <a
          href="#"
          className="mt-1 inline-flex items-center gap-1 text-[10px] font-medium text-primary transition-colors hover:text-primary/80"
        >
          Learn more about link tracking
          <ExternalLink className="h-2.5 w-2.5" />
        </a>
      </div>

      {/* Global tracking config */}
      <div className="mb-3">
        <p className="mb-2 text-[11px] font-semibold text-foreground">
          {linkContentIds.length > 1 ? "Default tracking for all links" : "Tracking parameters"}
        </p>
        <TrackingForm config={globalConfig} onChange={onGlobalConfigChange} />
      </div>

      {/* Per-content overrides */}
      {linkContentIds.length > 1 && (
        <div>
          <p className="mb-1.5 text-[11px] font-semibold text-foreground">
            Per-content overrides
          </p>
          <p className="mb-2 text-[10px] text-muted-foreground">
            Override or exclude tracking for individual content items.
          </p>
          <div className="space-y-1.5">
            {linkContentIds.map((id) => (
              <ContentOverrideRow
                key={id}
                contentId={id}
                title={linkContentTitles[id] || id}
                override={contentOverrides[id] || { mode: "inherit" as const }}
                onChange={(o) => onContentOverrideChange(id, o)}
              />
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

export default LinkTrackingSettings;
