import { useState } from "react";
import { cn } from "@/lib/utils";
import { Link2, Tag, ChevronDown, ChevronRight } from "lucide-react";
import MergeTagButton from "../MergeTagButton";

export type UTMMode = "shared" | "per-content";

export interface UTMParams {
  source: string;
  medium: string;
  campaign: string;
  term: string;
  content: string;
}

const EMPTY_UTM: UTMParams = {
  source: "",
  medium: "",
  campaign: "",
  term: "",
  content: "",
};

const MERGE_TAGS = [
  { tag: "{{content_id}}", label: "Content ID" },
  { tag: "{{network_name}}", label: "Network Name" },
  { tag: "{{recipient_id}}", label: "Recipient ID" },
  { tag: "{{recipient_email}}", label: "Recipient Email" },
  { tag: "{{recipient_first_name}}", label: "First Name" },
  { tag: "{{recipient_last_name}}", label: "Last Name" },
];

interface UTMFieldProps {
  label: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
}

const UTMField = ({ label, placeholder, value, onChange }: UTMFieldProps) => {
  const [inputRef, setInputRef] = useState<HTMLInputElement | null>(null);

  const insertTag = (tag: string) => {
    if (!inputRef) return;
    const start = inputRef.selectionStart ?? value.length;
    const end = inputRef.selectionEnd ?? value.length;
    const newValue = value.slice(0, start) + tag + value.slice(end);
    onChange(newValue);
    setTimeout(() => {
      inputRef.setSelectionRange(start + tag.length, start + tag.length);
      inputRef.focus();
    }, 0);
  };

  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <label className="text-[11px] font-medium text-muted-foreground">
          {label}
        </label>
        <div className="flex gap-0.5">
          {MERGE_TAGS.slice(0, 3).map((mt) => (
            <button
              key={mt.tag}
              type="button"
              onClick={() => insertTag(mt.tag)}
              className="rounded px-1 py-0.5 text-[9px] font-medium text-primary/70 transition-colors hover:bg-primary/10 hover:text-primary"
              title={`Insert ${mt.label}`}
            >
              {mt.label}
            </button>
          ))}
        </div>
      </div>
      <input
        ref={setInputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-8 w-full rounded-md border bg-background px-2 text-xs text-foreground outline-none focus:ring-1 focus:ring-ring placeholder:text-muted-foreground/50"
      />
    </div>
  );
};

interface UTMFormProps {
  params: UTMParams;
  onChange: (params: UTMParams) => void;
}

const UTMForm = ({ params, onChange }: UTMFormProps) => {
  const update = (key: keyof UTMParams) => (value: string) =>
    onChange({ ...params, [key]: value });

  return (
    <div className="space-y-2">
      <UTMField label="utm_source" placeholder="e.g. employee_advocacy" value={params.source} onChange={update("source")} />
      <UTMField label="utm_medium" placeholder="e.g. {{network_name}}" value={params.medium} onChange={update("medium")} />
      <UTMField label="utm_campaign" placeholder="e.g. q1_brand_2026" value={params.campaign} onChange={update("campaign")} />
      <UTMField label="utm_term" placeholder="e.g. {{recipient_id}}" value={params.term} onChange={update("term")} />
      <UTMField label="utm_content" placeholder="e.g. {{content_id}}" value={params.content} onChange={update("content")} />
    </div>
  );
};

interface UTMSettingsProps {
  linkContentIds: string[];
  linkContentTitles: Record<string, string>;
  mode: UTMMode;
  onModeChange: (m: UTMMode) => void;
  sharedParams: UTMParams;
  onSharedParamsChange: (p: UTMParams) => void;
  perContentParams: Record<string, UTMParams>;
  onPerContentParamsChange: (contentId: string, p: UTMParams) => void;
  embedded?: boolean;
}

const UTMSettings = ({
  linkContentIds,
  linkContentTitles,
  mode,
  onModeChange,
  sharedParams,
  onSharedParamsChange,
  perContentParams,
  onPerContentParamsChange,
  embedded = false,
}: UTMSettingsProps) => {
  const [expandedContent, setExpandedContent] = useState<string | null>(
    linkContentIds[0] || null
  );

  if (linkContentIds.length === 0) return null;

  const inner = (
    <>
      {!embedded && (
        <div className="mb-2 flex items-center gap-1.5">
          <Tag className="h-3 w-3 text-muted-foreground" />
          <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            UTM Parameters
          </label>
        </div>
      )}

      {!embedded && (
        <p className="mb-2.5 text-[10px] leading-snug text-muted-foreground">
          Add tracking parameters to link-type content URLs. Use merge tags for dynamic values.
        </p>
      )}

      {linkContentIds.length > 1 && (
        <div className="mb-3 flex gap-1 rounded-lg bg-secondary p-0.5">
          <button
            onClick={() => onModeChange("shared")}
            className={cn(
              "flex-1 rounded-md px-2 py-1.5 text-[11px] font-medium transition-all",
              mode === "shared"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Same for all
          </button>
          <button
            onClick={() => onModeChange("per-content")}
            className={cn(
              "flex-1 rounded-md px-2 py-1.5 text-[11px] font-medium transition-all",
              mode === "per-content"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Per content
          </button>
        </div>
      )}

      {mode === "shared" || linkContentIds.length === 1 ? (
        <div className="rounded-lg border bg-secondary/50 p-3">
          <UTMForm params={sharedParams} onChange={onSharedParamsChange} />
        </div>
      ) : (
        <div className="space-y-1.5">
          {linkContentIds.map((id) => {
            const isExpanded = expandedContent === id;
            const params = perContentParams[id] || EMPTY_UTM;
            return (
              <div key={id} className="rounded-lg border bg-secondary/50">
                <button
                  onClick={() => setExpandedContent(isExpanded ? null : id)}
                  className="flex w-full items-center gap-2 px-3 py-2 text-left"
                >
                  {isExpanded ? (
                    <ChevronDown className="h-3 w-3 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="h-3 w-3 text-muted-foreground" />
                  )}
                  <Link2 className="h-3 w-3 shrink-0 text-accent" />
                  <span className="truncate text-[11px] font-medium text-foreground">
                    {linkContentTitles[id] || id}
                  </span>
                </button>
                {isExpanded && (
                  <div className="border-t px-3 py-2.5">
                    <UTMForm
                      params={params}
                      onChange={(p) => onPerContentParamsChange(id, p)}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </>
  );

  if (embedded) return <div>{inner}</div>;

  return (
    <div className="border-b px-4 py-3">
      {inner}
    </div>
  );
};

export { EMPTY_UTM };
export default UTMSettings;
