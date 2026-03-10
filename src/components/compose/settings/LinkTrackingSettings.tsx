import { useState, useRef } from "react";
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
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  utmTerm: string;
  utmContent: string;
  customParams: TrackingParam[];
}

export type ContentTrackingMode = "inherit" | "override" | "exclude";

export interface ContentTrackingOverride {
  mode: ContentTrackingMode;
  config?: TrackingConfig;
}

export const EMPTY_TRACKING: TrackingConfig = {
  utmSource: "",
  utmMedium: "",
  utmCampaign: "",
  utmTerm: "",
  utmContent: "",
  customParams: [],
};

/* ─── Merge tags for tracking context ─── */

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

/* ─── Merge Tag Popover (per field) ─── */

const MergeTagPopover = ({
  onInsert,
}: {
  onInsert: (tag: string) => void;
}) => {
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
          <span>Insert tag</span>
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="w-52 p-0"
        sideOffset={4}
      >
        <div className="max-h-56 overflow-y-auto py-1">
          {groups.map((group) => (
            <div key={group}>
              <p className="px-3 py-1 text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">
                {group}
              </p>
              {TRACKING_MERGE_TAGS.filter((t) => t.group === group).map(
                (tag) => (
                  <button
                    key={tag.tag}
                    onClick={() => {
                      onInsert(tag.tag);
                      setOpen(false);
                    }}
                    className="flex w-full items-center justify-between px-3 py-1.5 text-left text-[11px] transition-colors hover:bg-secondary"
                  >
                    <span className="text-foreground">{tag.label}</span>
                    <span className="font-mono text-[9px] text-muted-foreground">
                      {tag.tag}
                    </span>
                  </button>
                )
              )}
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

/* ─── Single Tracking Field ─── */

interface TrackingFieldProps {
  label: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
}

const TrackingField = ({
  label,
  placeholder,
  value,
  onChange,
}: TrackingFieldProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const insertTag = (tag: string) => {
    const el = inputRef.current;
    if (!el) return;
    const start = el.selectionStart ?? value.length;
    const end = el.selectionEnd ?? value.length;
    const newValue = value.slice(0, start) + tag + value.slice(end);
    onChange(newValue);
    setTimeout(() => {
      el.setSelectionRange(start + tag.length, start + tag.length);
      el.focus();
    }, 0);
  };

  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <label className="text-[11px] font-medium text-muted-foreground">
          {label}
        </label>
        <MergeTagPopover onInsert={insertTag} />
      </div>
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-7 w-full rounded-md border bg-background px-2 text-xs text-foreground outline-none focus:ring-1 focus:ring-ring placeholder:text-muted-foreground/50"
      />
    </div>
  );
};

/* ─── Custom Param Row ─── */

const CustomParamRow = ({
  param,
  onChange,
  onRemove,
}: {
  param: TrackingParam;
  onChange: (p: TrackingParam) => void;
  onRemove: () => void;
}) => {
  const keyRef = useRef<HTMLInputElement>(null);
  const valRef = useRef<HTMLInputElement>(null);

  const insertTagToValue = (tag: string) => {
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

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-end">
        <MergeTagPopover onInsert={insertTagToValue} />
      </div>
      <div className="flex items-center gap-1.5">
        <input
          ref={keyRef}
          type="text"
          value={param.key}
          onChange={(e) => onChange({ ...param, key: e.target.value })}
          placeholder="key"
          className="h-7 flex-1 rounded-md border bg-background px-2 text-xs text-foreground outline-none focus:ring-1 focus:ring-ring placeholder:text-muted-foreground/50"
        />
        <input
          ref={valRef}
          type="text"
          value={param.value}
          onChange={(e) => onChange({ ...param, value: e.target.value })}
          placeholder="value"
          className="h-7 flex-1 rounded-md border bg-background px-2 text-xs text-foreground outline-none focus:ring-1 focus:ring-ring placeholder:text-muted-foreground/50"
        />
        <button
          onClick={onRemove}
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
        >
          <Trash2 className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
};

/* ─── Tracking Form (UTM fields + custom params) ─── */

const TrackingForm = ({
  config,
  onChange,
}: {
  config: TrackingConfig;
  onChange: (c: TrackingConfig) => void;
}) => {
  const updateUTM = (key: keyof TrackingConfig) => (value: string) =>
    onChange({ ...config, [key]: value });

  const addCustomParam = () =>
    onChange({
      ...config,
      customParams: [...config.customParams, { key: "", value: "" }],
    });

  const updateCustomParam = (index: number, param: TrackingParam) => {
    const next = [...config.customParams];
    next[index] = param;
    onChange({ ...config, customParams: next });
  };

  const removeCustomParam = (index: number) =>
    onChange({
      ...config,
      customParams: config.customParams.filter((_, i) => i !== index),
    });

  return (
    <div className="space-y-2">
      {/* Standard UTM fields */}
      <div className="space-y-2">
        <TrackingField
          label="utm_source"
          placeholder="e.g. employee_advocacy"
          value={config.utmSource}
          onChange={updateUTM("utmSource") as (v: string) => void}
        />
        <TrackingField
          label="utm_medium"
          placeholder="e.g. {{network_name}}"
          value={config.utmMedium}
          onChange={updateUTM("utmMedium") as (v: string) => void}
        />
        <TrackingField
          label="utm_campaign"
          placeholder="e.g. q1_brand_2026"
          value={config.utmCampaign}
          onChange={updateUTM("utmCampaign") as (v: string) => void}
        />
        <TrackingField
          label="utm_term"
          placeholder="e.g. {{recipient_id}}"
          value={config.utmTerm}
          onChange={updateUTM("utmTerm") as (v: string) => void}
        />
        <TrackingField
          label="utm_content"
          placeholder="e.g. {{content_id}}"
          value={config.utmContent}
          onChange={updateUTM("utmContent") as (v: string) => void}
        />
      </div>

      {/* Custom parameters */}
      {config.customParams.length > 0 && (
        <div className="border-t pt-2 mt-2">
          <p className="text-[10px] font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider">
            Custom parameters
          </p>
          <div className="space-y-2">
            {config.customParams.map((param, i) => (
              <CustomParamRow
                key={i}
                param={param}
                onChange={(p) => updateCustomParam(i, p)}
                onRemove={() => removeCustomParam(i)}
              />
            ))}
          </div>
        </div>
      )}

      <button
        onClick={addCustomParam}
        className="flex items-center gap-1 rounded-md px-2 py-1.5 text-[11px] font-medium text-primary/80 transition-colors hover:bg-primary/5 hover:text-primary"
      >
        <Plus className="h-3 w-3" />
        Add custom parameter
      </button>
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

        {/* Mode badges */}
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

        {/* Actions */}
        <div className="flex items-center gap-0.5">
          {mode !== "exclude" && (
            <button
              onClick={() =>
                onChange({
                  mode: "exclude",
                })
              }
              className="rounded p-1 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
              title="Exclude from tracking"
            >
              <Ban className="h-3 w-3" />
            </button>
          )}
          {mode === "exclude" && (
            <button
              onClick={() => onChange({ mode: "inherit" })}
              className="rounded p-1 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              title="Re-enable tracking"
            >
              <RotateCcw className="h-3 w-3" />
            </button>
          )}
          {mode !== "exclude" && (
            <button
              onClick={() => {
                if (mode === "override") {
                  onChange({ mode: "inherit" });
                  setExpanded(false);
                } else {
                  onChange({
                    mode: "override",
                    config: override.config || { ...EMPTY_TRACKING },
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
              title={
                mode === "override"
                  ? "Use global settings"
                  : "Set custom values"
              }
            >
              {mode === "override" ? (
                <ChevronDown className="h-3 w-3" />
              ) : (
                <ChevronRight className="h-3 w-3" />
              )}
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
  onContentOverrideChange: (
    contentId: string,
    o: ContentTrackingOverride
  ) => void;
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
          Add tracking tags to your links so you can see where clicks come from.
          Set values for all links, or customize per content.
        </p>
        <a
          href="#"
          className="mt-1 inline-flex items-center gap-1 text-[10px] font-medium text-primary transition-colors hover:text-primary/80"
        >
          Learn more
          <ExternalLink className="h-2.5 w-2.5" />
        </a>
      </div>

      {/* Global tracking config */}
      <div className="mb-3">
        <p className="mb-2 text-[11px] font-semibold text-foreground">
          Default tracking for all links
        </p>
        <div className="rounded-lg border bg-secondary/30 p-3">
          <TrackingForm
            config={globalConfig}
            onChange={onGlobalConfigChange}
          />
        </div>
      </div>

      {/* Per-content overrides (only show if multiple link contents) */}
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
                override={
                  contentOverrides[id] || { mode: "inherit" as const }
                }
                onChange={(o) => onContentOverrideChange(id, o)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Single content: allow exclude */}
      {linkContentIds.length === 1 && (
        <div className="mt-2">
          {(contentOverrides[linkContentIds[0]]?.mode === "exclude") ? (
            <button
              onClick={() =>
                onContentOverrideChange(linkContentIds[0], {
                  mode: "inherit",
                })
              }
              className="flex items-center gap-1.5 rounded-md px-2 py-1.5 text-[11px] font-medium text-primary transition-colors hover:bg-primary/5"
            >
              <RotateCcw className="h-3 w-3" />
              Re-enable tracking for this link
            </button>
          ) : (
            <button
              onClick={() =>
                onContentOverrideChange(linkContentIds[0], {
                  mode: "exclude",
                })
              }
              className="flex items-center gap-1.5 rounded-md px-2 py-1.5 text-[11px] font-medium text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
            >
              <Ban className="h-3 w-3" />
              Disable tracking for this link
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default LinkTrackingSettings;
