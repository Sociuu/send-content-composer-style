import { Switch } from "@/components/ui/switch";

export type FinalizationMode = "at-send-time" | "at-schedule-time";

interface RecipientFinalizationSettingsProps {
  mode: FinalizationMode;
  onModeChange: (mode: FinalizationMode) => void;
  removeDroppedMembers: boolean;
  onRemoveDroppedMembersChange: (val: boolean) => void;
}

const RecipientFinalizationSettings = ({
  mode,
  onModeChange,
  removeDroppedMembers,
  onRemoveDroppedMembersChange,
}: RecipientFinalizationSettingsProps) => {
  return (
    <div className="space-y-3">
      <label className="block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        Recipient Finalization
      </label>

      <div className="space-y-2">
        <label className="flex cursor-pointer items-start gap-2.5 rounded-lg border p-2.5 transition-colors hover:bg-secondary/50">
          <input
            type="radio"
            name="finalization"
            checked={mode === "at-send-time"}
            onChange={() => onModeChange("at-send-time")}
            className="mt-0.5 h-3.5 w-3.5 accent-primary"
          />
          <div>
            <span className="text-xs font-medium text-foreground">Finalize at send time</span>
            <p className="mt-0.5 text-[11px] text-muted-foreground">
              Recipients are resolved when the message is actually sent. Group changes up until that point are reflected.
            </p>
          </div>
        </label>

        <label className="flex cursor-pointer items-start gap-2.5 rounded-lg border p-2.5 transition-colors hover:bg-secondary/50">
          <input
            type="radio"
            name="finalization"
            checked={mode === "at-schedule-time"}
            onChange={() => onModeChange("at-schedule-time")}
            className="mt-0.5 h-3.5 w-3.5 accent-primary"
          />
          <div>
            <span className="text-xs font-medium text-foreground">Lock at schedule time</span>
            <p className="mt-0.5 text-[11px] text-muted-foreground">
              Recipients are frozen when you schedule. New members added to groups later won't receive the message.
            </p>
          </div>
        </label>
      </div>

      {mode === "at-schedule-time" && (
        <div className="flex items-center justify-between rounded-lg border bg-secondary/50 p-2.5">
          <div>
            <span className="text-xs font-medium text-foreground">Remove dropped members</span>
            <p className="text-[11px] text-muted-foreground">
              Remove recipients later removed from their group (directly selected recipients always stay)
            </p>
          </div>
          <Switch
            checked={removeDroppedMembers}
            onCheckedChange={onRemoveDroppedMembersChange}
            className="ml-3 shrink-0"
          />
        </div>
      )}
    </div>
  );
};

export default RecipientFinalizationSettings;
