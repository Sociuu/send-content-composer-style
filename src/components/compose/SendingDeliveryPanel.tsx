import { Timer, RotateCcw, Zap, CalendarClock, Clock } from "lucide-react";
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

const SectionCard = ({
  icon: Icon,
  title,
  children,
}: {
  icon: typeof Timer;
  title: string;
  children: React.ReactNode;
}) => (
  <div className="rounded-xl border bg-card p-4">
    <div className="mb-3 flex items-center gap-2">
      <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary/10">
        <Icon className="h-3.5 w-3.5 text-primary" />
      </div>
      <span className="text-xs font-semibold text-foreground">{title}</span>
    </div>
    {children}
  </div>
);

const SendingDeliveryPanel = (props: SendingDeliveryPanelProps) => {
  return (
    <div className="mx-auto w-full max-w-2xl px-6 pb-6">
      <div className="relative">
        {/* Section divider */}
        <div className="mb-4 flex items-center gap-3">
          <div className="h-px flex-1 bg-border" />
          <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            Sending & Delivery
          </span>
          <div className="h-px flex-1 bg-border" />
        </div>

        <div className="space-y-3">
          {/* When to Send */}
          <SectionCard
            icon={props.sendMode === "now" ? Zap : CalendarClock}
            title="When to Send"
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
          </SectionCard>

          {/* Pulsing + Delivery Window */}
          <SectionCard icon={Timer} title="Pulsing">
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
          </SectionCard>

          {/* Resend */}
          <SectionCard icon={RotateCcw} title="Resend">
            <ResendSettings
              enabled={props.resendEnabled}
              onEnabledChange={props.onResendEnabledChange}
              daysAfter={props.resendDays}
              onDaysAfterChange={props.onResendDaysChange}
            />
          </SectionCard>
        </div>
      </div>
    </div>
  );
};

export default SendingDeliveryPanel;
