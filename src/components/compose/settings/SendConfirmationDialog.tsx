import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import {
  Clock,
  Users,
  Zap,
  CalendarClock,
  Shuffle,
  List,
  SplitSquareHorizontal,
  RotateCcw,
  Timer,
} from "lucide-react";
import type { SendMode } from "./SendModeSettings";
import type { FinalizationMode } from "./RecipientFinalizationSettings";
import type { PulsingMode, TimeUnit } from "./PulsingSettings";
import type { ContentDistribution } from "./ContentDistributionSettings";

interface SendConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;

  sendMode: SendMode;
  scheduleDate?: Date;
  scheduleTime: string;
  timezone: string;

  hasGroupRecipients: boolean;
  finalizationMode: FinalizationMode;

  pulsingEnabled: boolean;
  pulsingMode: PulsingMode;
  rateCount: number;
  rateUnit: TimeUnit;
  distributeDuration: number;
  distributeUnit: TimeUnit;

  deliveryWindowEnabled: boolean;
  allowedDays: string[];
  windowStartTime: string;
  windowEndTime: string;

  contentCount: number;
  contentDistribution: ContentDistribution;

  resendEnabled: boolean;
  resendDays: number;
}

const DAY_LABELS: Record<string, string> = {
  mon: "Mon", tue: "Tue", wed: "Wed", thu: "Thu", fri: "Fri", sat: "Sat", sun: "Sun",
};

const SummaryRow = ({ icon: Icon, label, value }: { icon: typeof Clock; label: string; value: string }) => (
  <div className="flex items-start gap-2.5 py-1.5">
    <Icon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
    <div>
      <span className="text-[11px] text-muted-foreground">{label}</span>
      <p className="text-xs font-medium text-foreground">{value}</p>
    </div>
  </div>
);

const SendConfirmationDialog = ({
  open,
  onOpenChange,
  onConfirm,
  sendMode,
  scheduleDate,
  scheduleTime,
  timezone,
  hasGroupRecipients,
  finalizationMode,
  pulsingEnabled,
  pulsingMode,
  rateCount,
  rateUnit,
  distributeDuration,
  distributeUnit,
  deliveryWindowEnabled,
  allowedDays,
  windowStartTime,
  windowEndTime,
  contentCount,
  contentDistribution,
  resendEnabled,
  resendDays,
}: SendConfirmationDialogProps) => {
  const actionLabel = sendMode === "now" ? "Send Now" : "Schedule";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-base">
            Confirm {sendMode === "now" ? "Send" : "Schedule"}
          </DialogTitle>
        </DialogHeader>

        <div className="divide-y">
          {/* Send mode */}
          <SummaryRow
            icon={sendMode === "now" ? Zap : CalendarClock}
            label="Delivery"
            value={
              sendMode === "now"
                ? "Send immediately"
                : `${scheduleDate ? format(scheduleDate, "MMM d, yyyy") : "—"} at ${scheduleTime || "—"} (${timezone})`
            }
          />

          {/* Recipient finalization */}
          {sendMode === "schedule" && hasGroupRecipients && (
            <SummaryRow
              icon={Users}
              label="Recipient finalization"
              value={
                finalizationMode === "at-send-time"
                  ? "Finalize at send time"
                  : "Lock at schedule time"
              }
            />
          )}

          {/* Pulsing */}
          {pulsingEnabled && (
            <SummaryRow
              icon={Timer}
              label="Pulsing"
              value={
                pulsingMode === "rate"
                  ? `${rateCount} messages per ${rateUnit}`
                  : `Distribute over ${distributeDuration} ${distributeUnit}`
              }
            />
          )}

          {/* Delivery Window */}
          {deliveryWindowEnabled && (
            <SummaryRow
              icon={Clock}
              label="Delivery window"
              value={`${allowedDays.map((d) => DAY_LABELS[d] || d).join(", ")} · ${windowStartTime}–${windowEndTime}`}
            />
          )}

          {/* Content distribution */}
          {contentCount >= 2 && (
            <SummaryRow
              icon={
                contentDistribution === "randomize"
                  ? Shuffle
                  : contentDistribution === "split"
                  ? SplitSquareHorizontal
                  : List
              }
              label="Content"
              value={
                contentDistribution === "randomize"
                  ? "Randomized order"
                  : contentDistribution === "split"
                  ? "Split send (one per recipient)"
                  : "Manual order"
              }
            />
          )}

          {/* Resend */}
          {resendEnabled && (
            <SummaryRow
              icon={RotateCcw}
              label="Resend to non-openers"
              value={`Once after ${resendDays} day${resendDays !== 1 ? "s" : ""}`}
            />
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onConfirm}>
            {actionLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SendConfirmationDialog;
