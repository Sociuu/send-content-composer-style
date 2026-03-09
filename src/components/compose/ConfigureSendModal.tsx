import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ArrowRight, Zap, CalendarClock, Timer, Clock, RotateCcw } from "lucide-react";
import SendModeSettings, { type SendMode } from "./settings/SendModeSettings";
import RecipientFinalizationSettings, { type FinalizationMode } from "./settings/RecipientFinalizationSettings";
import PulsingSettings, { type PulsingMode, type TimeUnit } from "./settings/PulsingSettings";
import DeliveryWindowSettings from "./settings/DeliveryWindowSettings";
import ResendSettings from "./settings/ResendSettings";
import SendConfirmationDialog from "./settings/SendConfirmationDialog";
import type { ContentDistribution } from "./settings/ContentDistributionSettings";

interface ConfigureSendModalProps {
  contentCount: number;
  hasGroupRecipients: boolean;
  contentDistribution: ContentDistribution;
}

const SectionWrapper = ({
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

const ConfigureSendModal = ({ contentCount, hasGroupRecipients, contentDistribution }: ConfigureSendModalProps) => {
  const [open, setOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const [sendMode, setSendMode] = useState<SendMode>("now");
  const [scheduleDate, setScheduleDate] = useState<Date | undefined>();
  const [scheduleTime, setScheduleTime] = useState("09:00");
  const [timezone, setTimezone] = useState("Europe/Copenhagen");
  const [finalizationMode, setFinalizationMode] = useState<FinalizationMode>("at-send-time");
  const [removeDropped, setRemoveDropped] = useState(false);
  const [pulsingEnabled, setPulsingEnabled] = useState(false);
  const [pulsingMode, setPulsingMode] = useState<PulsingMode>("rate");
  const [rateCount, setRateCount] = useState(50);
  const [rateUnit, setRateUnit] = useState<TimeUnit>("hours");
  const [distributeDuration, setDistributeDuration] = useState(4);
  const [distributeUnit, setDistributeUnit] = useState<TimeUnit>("hours");
  const [deliveryWindowEnabled, setDeliveryWindowEnabled] = useState(false);
  const [allowedDays, setAllowedDays] = useState<string[]>(["mon", "tue", "wed", "thu", "fri"]);
  const [windowStartTime, setWindowStartTime] = useState("08:00");
  const [windowEndTime, setWindowEndTime] = useState("17:00");
  const [windowTimezone, setWindowTimezone] = useState("Europe/Copenhagen");
  const [resendEnabled, setResendEnabled] = useState(false);
  const [resendDays, setResendDays] = useState(3);

  const actionLabel = sendMode === "now" ? "Send Now" : "Schedule Send";

  return (
    <>
      <div className="border-t bg-card">
        <div className="flex items-center justify-between px-6 py-3">
          <div />
          <div className="flex items-center gap-2">
            <button className="rounded-lg px-4 py-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
              Save Draft
            </button>
            <button
              onClick={() => setOpen(true)}
              className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2 text-xs font-semibold text-primary-foreground transition-all hover:opacity-90"
            >
              Review & Send
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg p-0">
          <DialogHeader className="sticky top-0 z-10 border-b bg-card px-6 py-4">
            <DialogTitle className="text-sm font-semibold">Review & Send</DialogTitle>
            <p className="text-[11px] text-muted-foreground">
              Configure delivery options before sending your message.
            </p>
          </DialogHeader>

          <div className="space-y-3 px-6 py-4">
            {/* 1. Pulsing */}
            <SectionWrapper icon={Timer} title="Pulsing">
              <PulsingSettings
                enabled={pulsingEnabled}
                onEnabledChange={setPulsingEnabled}
                mode={pulsingMode}
                onModeChange={setPulsingMode}
                rateCount={rateCount}
                onRateCountChange={setRateCount}
                rateUnit={rateUnit}
                onRateUnitChange={setRateUnit}
                distributeDuration={distributeDuration}
                onDistributeDurationChange={setDistributeDuration}
                distributeUnit={distributeUnit}
                onDistributeUnitChange={setDistributeUnit}
                estimatedFirst="Mar 10, 2026 at 09:00"
                estimatedLast="Mar 10, 2026 at 13:00"
              />

              {/* Delivery Window nested under Pulsing when enabled */}
              {pulsingEnabled && (
                <div className="mt-3 border-t pt-3">
                  <DeliveryWindowSettings
                    enabled={deliveryWindowEnabled}
                    onEnabledChange={setDeliveryWindowEnabled}
                    allowedDays={allowedDays}
                    onAllowedDaysChange={setAllowedDays}
                    startTime={windowStartTime}
                    onStartTimeChange={setWindowStartTime}
                    endTime={windowEndTime}
                    onEndTimeChange={setWindowEndTime}
                    timezone={windowTimezone}
                    onTimezoneChange={setWindowTimezone}
                  />
                </div>
              )}
            </SectionWrapper>

            {/* 2. Resend */}
            <SectionWrapper icon={RotateCcw} title="Resend">
              <ResendSettings
                enabled={resendEnabled}
                onEnabledChange={setResendEnabled}
                daysAfter={resendDays}
                onDaysAfterChange={setResendDays}
              />
            </SectionWrapper>

            {/* 3. Send Mode — final step */}
            <SectionWrapper
              icon={sendMode === "now" ? Zap : CalendarClock}
              title="When to Send"
            >
              <SendModeSettings
                mode={sendMode}
                onModeChange={setSendMode}
                scheduleDate={scheduleDate}
                onScheduleDateChange={setScheduleDate}
                scheduleTime={scheduleTime}
                onScheduleTimeChange={setScheduleTime}
                timezone={timezone}
                onTimezoneChange={setTimezone}
              />

              {/* Recipient finalization — only for scheduled group sends */}
              {sendMode === "schedule" && hasGroupRecipients && (
                <div className="mt-3 border-t pt-3">
                  <RecipientFinalizationSettings
                    mode={finalizationMode}
                    onModeChange={setFinalizationMode}
                    removeDroppedMembers={removeDropped}
                    onRemoveDroppedMembersChange={setRemoveDropped}
                  />
                </div>
              )}
            </SectionWrapper>
          </div>

          {/* Sticky footer */}
          <div className="sticky bottom-0 flex items-center justify-between border-t bg-card px-6 py-3">
            <button
              onClick={() => setOpen(false)}
              className="rounded-lg px-4 py-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              Cancel
            </button>
            <Button
              size="sm"
              onClick={() => {
                setOpen(false);
                setConfirmOpen(true);
              }}
              className="gap-1.5"
            >
              {actionLabel}
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <SendConfirmationDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        onConfirm={() => setConfirmOpen(false)}
        sendMode={sendMode}
        scheduleDate={scheduleDate}
        scheduleTime={scheduleTime}
        timezone={timezone}
        hasGroupRecipients={hasGroupRecipients}
        finalizationMode={finalizationMode}
        pulsingEnabled={pulsingEnabled}
        pulsingMode={pulsingMode}
        rateCount={rateCount}
        rateUnit={rateUnit}
        distributeDuration={distributeDuration}
        distributeUnit={distributeUnit}
        deliveryWindowEnabled={deliveryWindowEnabled}
        allowedDays={allowedDays}
        windowStartTime={windowStartTime}
        windowEndTime={windowEndTime}
        contentCount={contentCount}
        contentDistribution={contentDistribution}
        resendEnabled={resendEnabled}
        resendDays={resendDays}
      />
    </>
  );
};

export default ConfigureSendModal;
