import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { Timer } from "lucide-react";

export type PulsingMode = "rate" | "distribute";
export type TimeUnit = "hours" | "days" | "weeks";

interface PulsingSettingsProps {
  enabled: boolean;
  onEnabledChange: (val: boolean) => void;
  mode: PulsingMode;
  onModeChange: (mode: PulsingMode) => void;
  rateCount: number;
  onRateCountChange: (n: number) => void;
  rateUnit: TimeUnit;
  onRateUnitChange: (u: TimeUnit) => void;
  distributeDuration: number;
  onDistributeDurationChange: (n: number) => void;
  distributeUnit: TimeUnit;
  onDistributeUnitChange: (u: TimeUnit) => void;
  estimatedFirst?: string;
  estimatedLast?: string;
}

const UNITS: { value: TimeUnit; label: string }[] = [
  { value: "hours", label: "Hours" },
  { value: "days", label: "Days" },
  { value: "weeks", label: "Weeks" },
];

const PulsingSettings = ({
  enabled,
  onEnabledChange,
  mode,
  onModeChange,
  rateCount,
  onRateCountChange,
  rateUnit,
  onRateUnitChange,
  distributeDuration,
  onDistributeDurationChange,
  distributeUnit,
  onDistributeUnitChange,
  estimatedFirst,
  estimatedLast,
}: PulsingSettingsProps) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Pulsing
        </label>
        <Switch checked={enabled} onCheckedChange={onEnabledChange} />
      </div>

      {enabled && (
        <div className="space-y-3 rounded-lg border bg-secondary/50 p-3">
          {/* Mode selector */}
          <div className="flex gap-1 rounded-lg bg-muted p-0.5">
            <button
              onClick={() => onModeChange("rate")}
              className={cn(
                "flex-1 rounded-md px-2 py-1.5 text-[11px] font-medium transition-all",
                mode === "rate"
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Rate limit
            </button>
            <button
              onClick={() => onModeChange("distribute")}
              className={cn(
                "flex-1 rounded-md px-2 py-1.5 text-[11px] font-medium transition-all",
                mode === "distribute"
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Distribute evenly
            </button>
          </div>

          {mode === "rate" ? (
            <div className="flex items-end gap-2">
              <div className="flex-1">
                <label className="mb-1 block text-[11px] font-medium text-muted-foreground">
                  Messages
                </label>
                <input
                  type="number"
                  min={1}
                  value={rateCount}
                  onChange={(e) => onRateCountChange(Number(e.target.value))}
                  className="h-8 w-full rounded-md border bg-background px-2 text-xs text-foreground outline-none focus:ring-1 focus:ring-ring"
                />
              </div>
              <span className="pb-1.5 text-[11px] text-muted-foreground">per</span>
              <div className="flex-1">
                <label className="mb-1 block text-[11px] font-medium text-muted-foreground">
                  Time unit
                </label>
                <select
                  value={rateUnit}
                  onChange={(e) => onRateUnitChange(e.target.value as TimeUnit)}
                  className="h-8 w-full rounded-md border bg-background px-2 text-xs text-foreground outline-none focus:ring-1 focus:ring-ring"
                >
                  {UNITS.map((u) => (
                    <option key={u.value} value={u.value}>{u.label}</option>
                  ))}
                </select>
              </div>
            </div>
          ) : (
            <div className="flex items-end gap-2">
              <div className="flex-1">
                <label className="mb-1 block text-[11px] font-medium text-muted-foreground">
                  Duration
                </label>
                <input
                  type="number"
                  min={1}
                  value={distributeDuration}
                  onChange={(e) => onDistributeDurationChange(Number(e.target.value))}
                  className="h-8 w-full rounded-md border bg-background px-2 text-xs text-foreground outline-none focus:ring-1 focus:ring-ring"
                />
              </div>
              <div className="flex-1">
                <label className="mb-1 block text-[11px] font-medium text-muted-foreground">
                  Unit
                </label>
                <select
                  value={distributeUnit}
                  onChange={(e) => onDistributeUnitChange(e.target.value as TimeUnit)}
                  className="h-8 w-full rounded-md border bg-background px-2 text-xs text-foreground outline-none focus:ring-1 focus:ring-ring"
                >
                  {UNITS.map((u) => (
                    <option key={u.value} value={u.value}>{u.label}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Estimated delivery */}
          {(estimatedFirst || estimatedLast) && (
            <div className="flex items-start gap-2 rounded-md bg-accent/10 p-2">
              <Timer className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" />
              <div className="text-[11px] text-foreground">
                {estimatedFirst && <div>First delivery: <span className="font-medium">{estimatedFirst}</span></div>}
                {estimatedLast && <div>Last delivery: <span className="font-medium">{estimatedLast}</span></div>}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PulsingSettings;
