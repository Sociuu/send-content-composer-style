import { Switch } from "@/components/ui/switch";
import { RotateCcw } from "lucide-react";

interface ResendSettingsProps {
  enabled: boolean;
  onEnabledChange: (val: boolean) => void;
  daysAfter: number;
  onDaysAfterChange: (n: number) => void;
}

const ResendSettings = ({
  enabled,
  onEnabledChange,
  daysAfter,
  onDaysAfterChange,
}: ResendSettingsProps) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          <RotateCcw className="h-3 w-3" />
          Resend to Non-Openers
        </label>
        <Switch checked={enabled} onCheckedChange={onEnabledChange} />
      </div>

      {enabled && (
        <div className="rounded-lg border bg-secondary/50 p-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-foreground">Resend once after</span>
            <input
              type="number"
              min={1}
              value={daysAfter}
              onChange={(e) => onDaysAfterChange(Math.max(1, Number(e.target.value)))}
              className="h-8 w-16 rounded-md border bg-background px-2 text-center text-xs text-foreground outline-none focus:ring-1 focus:ring-ring"
            />
            <span className="text-xs text-foreground">days</span>
          </div>
          <p className="mt-2 text-[11px] text-muted-foreground">
            Only recipients who haven't opened will receive the resend. Eligibility validation applies.
          </p>
        </div>
      )}
    </div>
  );
};

export default ResendSettings;
