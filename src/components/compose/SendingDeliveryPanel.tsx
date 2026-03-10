import { useState } from "react";
import {
  Timer,
  RotateCcw,
  Zap,
  CalendarClock,
  Clock,
  Pencil,
  Check,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import PulsingSettings, { type PulsingMode, type TimeUnit } from "./settings/PulsingSettings";
import DeliveryWindowSettings from "./settings/DeliveryWindowSettings";
import ResendSettings from "./settings/ResendSettings";
import SendModeSettings, { type SendMode } from "./settings/SendModeSettings";
import RecipientFinalizationSettings, { type FinalizationMode } from "./settings/RecipientFinalizationSettings";

interface SendingDeliveryPanelProps {
  sendMode: SendMode;
  onSendModeChange: (m: SendMode) => void;
  scheduleDate: Date | undefined;
  onScheduleDateChange: (d: Date | undefined) => void;
  scheduleTime: string;
  onScheduleTimeChange: (t: string) => void;
  timezone: string;
  onTimezoneChange: (tz: string) => void;

  hasGroupRecipients: boolean;
  finalizationMode: FinalizationMode;
  onFinalizationModeChange: (m: FinalizationMode) => void;
  removeDropped: boolean;
  onRemoveDroppedChange: (v: boolean) => void;

  pulsingEnabled: boolean;
  onPulsingEnabledChange: (v: boolean) => void;
  pulsingMode: PulsingMode;
  onPulsingModeChange: (m: PulsingMode) => void;
  rateCount: number;
  onRateCountChange: (n: number) => void;
  rateUnit: TimeUnit;
  onRateUnitChange: (u: TimeUnit) => void;
  distributeDuration: number;
  onDistributeDurationChange: (n: number) => void;
  distributeUnit: TimeUnit;
  onDistributeUnitChange: (u: TimeUnit) => void;

  deliveryWindowEnabled: boolean;
  onDeliveryWindowEnabledChange: (v: boolean) => void;
  allowedDays: string[];
  onAllowedDaysChange: (d: string[]) => void;
  windowStartTime: string;
  onWindowStartTimeChange: (t: string) => void;
  windowEndTime: string;
  onWindowEndTimeChange: (t: string) => void;
  windowTimezone: string;
  onWindowTimezoneChange: (tz: string) => void;

  resendEnabled: boolean;
  onResendEnabledChange: (v: boolean) => void;
  resendDays: number;
  onResendDaysChange: (n: number) => void;
}

type ModalId = "pulsing" | "resend" | null;

const DAY_LABELS: Record<string, string> = {
  mon: "Mon", tue: "Tue", wed: "Wed", thu: "Thu", fri: "Fri", sat: "Sat", sun: "Sun",
};

/* ─── Summary Row ─── */
const SummaryRow = ({
  icon: Icon,
  title,
  summary,
  detail,
  isActive,
  onEdit,
  isLast,
}: {
  icon: typeof Timer;
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

/* ─── Main Panel ─── */
const SendingDeliveryPanel = (props: SendingDeliveryPanelProps) => {
  const [activeModal, setActiveModal] = useState<ModalId>(null);

  // Build summaries
  const pulsingActive = props.pulsingEnabled;
  const pulsingSummary = !pulsingActive
    ? "Off — all messages sent at once"
    : props.pulsingMode === "rate"
    ? `Rate limit: ${props.rateCount} per ${props.rateUnit}`
    : `Distribute evenly over ${props.distributeDuration} ${props.distributeUnit}`;
  const pulsingDetail =
    pulsingActive && props.deliveryWindowEnabled
      ? `Window: ${props.allowedDays.map((d) => DAY_LABELS[d] || d).join(", ")} · ${props.windowStartTime}–${props.windowEndTime}`
      : undefined;

  const resendActive = props.resendEnabled;
  const resendSummary = !resendActive
    ? "Off — no automatic resend"
    : `Resend to non-openers after ${props.resendDays} day${props.resendDays !== 1 ? "s" : ""}`;

  const whenActive = props.sendMode === "schedule";
  const whenSummary =
    props.sendMode === "now"
      ? "Send immediately"
      : props.scheduleDate
      ? `${format(props.scheduleDate, "MMM d, yyyy")} at ${props.scheduleTime} (${props.timezone.split("/")[1]?.replace("_", " ") || props.timezone})`
      : "Scheduled — pick a date";
  const whenDetail =
    whenActive && props.hasGroupRecipients
      ? props.finalizationMode === "at-send-time"
        ? "Recipients finalized at send time"
        : "Recipients locked at schedule time"
      : undefined;

  return (
    <div className="mx-auto w-full max-w-2xl px-6 pb-6">
      {/* Section divider */}
      <div className="mb-4 flex items-center gap-3">
        <div className="h-px flex-1 bg-border" />
        <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
          Sending & Delivery
        </span>
        <div className="h-px flex-1 bg-border" />
      </div>

      {/* Summary card */}
      <div className="overflow-hidden rounded-xl border bg-card">
        <SummaryRow
          icon={Timer}
          title="Pulsing"
          summary={pulsingSummary}
          detail={pulsingDetail}
          isActive={pulsingActive}
          onEdit={() => setActiveModal("pulsing")}
        />
        <SummaryRow
          icon={RotateCcw}
          title="Resend"
          summary={resendSummary}
          isActive={resendActive}
          onEdit={() => setActiveModal("resend")}
          isLast
        />
      </div>

      {/* When to Send — always visible inline */}
      <div className="mt-4 overflow-hidden rounded-xl border bg-card">
        <div className="px-4 py-3">
          <div className="flex items-center gap-2 mb-3">
            <div className={cn(
              "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg",
              whenActive ? "bg-primary/10" : "bg-secondary"
            )}>
              {props.sendMode === "now" ? (
                <Zap className={cn("h-3.5 w-3.5", whenActive ? "text-primary" : "text-muted-foreground")} />
              ) : (
                <CalendarClock className={cn("h-3.5 w-3.5", whenActive ? "text-primary" : "text-muted-foreground")} />
              )}
            </div>
            <span className="text-xs font-semibold text-foreground">When to Send</span>
          </div>

          <SendModeSettings
            mode={props.sendMode}
            onModeChange={props.onSendModeChange}
            scheduleDate={props.scheduleDate}
            onScheduleDateChange={props.onScheduleDateChange}
            scheduleTime={props.scheduleTime}
            onScheduleTimeChange={props.onScheduleTimeChange}
            timezone={props.timezone}
            onTimezoneChange={props.onTimezoneChange}
          />

          {props.sendMode === "schedule" && props.hasGroupRecipients && (
            <div className="border-t mt-3 pt-3">
              <RecipientFinalizationSettings
                mode={props.finalizationMode}
                onModeChange={props.onFinalizationModeChange}
                removeDroppedMembers={props.removeDropped}
                onRemoveDroppedMembersChange={props.onRemoveDroppedChange}
              />
            </div>
          )}
        </div>
      </div>

      {/* ─── Edit Modals ─── */}
      <EditModal
        open={activeModal === "pulsing"}
        onClose={() => setActiveModal(null)}
        title="Pulsing & Delivery Window"
      >
        <div className="space-y-4">
          <PulsingSettings
            enabled={props.pulsingEnabled}
            onEnabledChange={props.onPulsingEnabledChange}
            mode={props.pulsingMode}
            onModeChange={props.onPulsingModeChange}
            rateCount={props.rateCount}
            onRateCountChange={props.onRateCountChange}
            rateUnit={props.rateUnit}
            onRateUnitChange={props.onRateUnitChange}
            distributeDuration={props.distributeDuration}
            onDistributeDurationChange={props.onDistributeDurationChange}
            distributeUnit={props.distributeUnit}
            onDistributeUnitChange={props.onDistributeUnitChange}
            estimatedFirst="Mar 10, 2026 at 09:00"
            estimatedLast="Mar 10, 2026 at 13:00"
          />

          {props.pulsingEnabled && (
            <div className="border-t pt-4">
              <DeliveryWindowSettings
                enabled={props.deliveryWindowEnabled}
                onEnabledChange={props.onDeliveryWindowEnabledChange}
                allowedDays={props.allowedDays}
                onAllowedDaysChange={props.onAllowedDaysChange}
                startTime={props.windowStartTime}
                onStartTimeChange={props.onWindowStartTimeChange}
                endTime={props.windowEndTime}
                onEndTimeChange={props.onWindowEndTimeChange}
                timezone={props.windowTimezone}
                onTimezoneChange={props.onWindowTimezoneChange}
              />
            </div>
          )}
        </div>
      </EditModal>

      <EditModal
        open={activeModal === "resend"}
        onClose={() => setActiveModal(null)}
        title="Resend to Non-Openers"
      >
        <ResendSettings
          enabled={props.resendEnabled}
          onEnabledChange={props.onResendEnabledChange}
          daysAfter={props.resendDays}
          onDaysAfterChange={props.onResendDaysChange}
        />
      </EditModal>

      <EditModal
        open={activeModal === "when"}
        onClose={() => setActiveModal(null)}
        title="When to Send"
      >
        <div className="space-y-4">
          <SendModeSettings
            mode={props.sendMode}
            onModeChange={props.onSendModeChange}
            scheduleDate={props.scheduleDate}
            onScheduleDateChange={props.onScheduleDateChange}
            scheduleTime={props.scheduleTime}
            onScheduleTimeChange={props.onScheduleTimeChange}
            timezone={props.timezone}
            onTimezoneChange={props.onTimezoneChange}
          />

          {props.sendMode === "schedule" && props.hasGroupRecipients && (
            <div className="border-t pt-4">
              <RecipientFinalizationSettings
                mode={props.finalizationMode}
                onModeChange={props.onFinalizationModeChange}
                removeDroppedMembers={props.removeDropped}
                onRemoveDroppedMembersChange={props.onRemoveDroppedChange}
              />
            </div>
          )}
        </div>
      </EditModal>
    </div>
  );
};

export default SendingDeliveryPanel;
