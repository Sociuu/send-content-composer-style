import { useState } from "react";
import { Timer, RotateCcw, Zap, CalendarClock, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
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

type SectionId = "pulsing" | "resend" | "when";

const CollapsibleSection = ({
  icon: Icon,
  title,
  badge,
  isOpen,
  onToggle,
  children,
}: {
  icon: typeof Timer;
  title: string;
  badge?: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) => (
  <div>
    <button
      onClick={onToggle}
      className="flex w-full items-center gap-2 py-1 text-left transition-colors hover:opacity-80"
    >
      <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary/10">
        <Icon className="h-3.5 w-3.5 text-primary" />
      </div>
      <span className="flex-1 text-xs font-semibold text-foreground">{title}</span>
      {badge && !isOpen && (
        <span className="rounded-md bg-secondary px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
          {badge}
        </span>
      )}
      <ChevronDown
        className={cn(
          "h-3.5 w-3.5 text-muted-foreground transition-transform",
          isOpen && "rotate-180"
        )}
      />
    </button>
    {isOpen && <div className="mt-3">{children}</div>}
  </div>
);

const SendingDeliveryPanel = (props: SendingDeliveryPanelProps) => {
  const [openSections, setOpenSections] = useState<Set<SectionId>>(
    new Set(["pulsing", "when"])
  );

  const toggle = (id: SectionId) => {
    setOpenSections((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Build summary badges for collapsed sections
  const pulsingBadge = props.pulsingEnabled
    ? props.pulsingMode === "rate"
      ? `${props.rateCount}/${props.rateUnit}`
      : `Over ${props.distributeDuration} ${props.distributeUnit}`
    : "Off";

  const resendBadge = props.resendEnabled
    ? `After ${props.resendDays}d`
    : "Off";

  const whenBadge = props.sendMode === "now" ? "Immediately" : "Scheduled";

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

      <div className="rounded-xl border bg-card p-4 space-y-4">
        {/* 1. Pulsing + Delivery Window */}
        <CollapsibleSection
          icon={Timer}
          title="Pulsing"
          badge={pulsingBadge}
          isOpen={openSections.has("pulsing")}
          onToggle={() => toggle("pulsing")}
        >
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
            <div className="mt-3 border-t pt-3">
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
        </CollapsibleSection>

        <div className="h-px bg-border" />

        {/* 2. Resend */}
        <CollapsibleSection
          icon={RotateCcw}
          title="Resend"
          badge={resendBadge}
          isOpen={openSections.has("resend")}
          onToggle={() => toggle("resend")}
        >
          <ResendSettings
            enabled={props.resendEnabled}
            onEnabledChange={props.onResendEnabledChange}
            daysAfter={props.resendDays}
            onDaysAfterChange={props.onResendDaysChange}
          />
        </CollapsibleSection>

        <div className="h-px bg-border" />

        {/* 3. When to Send */}
        <CollapsibleSection
          icon={props.sendMode === "now" ? Zap : CalendarClock}
          title="When to Send"
          badge={whenBadge}
          isOpen={openSections.has("when")}
          onToggle={() => toggle("when")}
        >
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
            <div className="mt-3 border-t pt-3">
              <RecipientFinalizationSettings
                mode={props.finalizationMode}
                onModeChange={props.onFinalizationModeChange}
                removeDroppedMembers={props.removeDropped}
                onRemoveDroppedMembersChange={props.onRemoveDroppedChange}
              />
            </div>
          )}
        </CollapsibleSection>
      </div>
    </div>
  );
};

export default SendingDeliveryPanel;
