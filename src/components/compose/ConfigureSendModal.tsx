import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowRight } from "lucide-react";
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

  const actionLabel = sendMode === "now" ? "Send Message" : "Schedule Message";

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
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-sm font-semibold">Configure Sending</DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-x-8 gap-y-6 py-2">
            <div className="space-y-6">
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

              {sendMode === "schedule" && hasGroupRecipients && (
                <RecipientFinalizationSettings
                  mode={finalizationMode}
                  onModeChange={setFinalizationMode}
                  removeDroppedMembers={removeDropped}
                  onRemoveDroppedMembersChange={setRemoveDropped}
                />
              )}
            </div>

            <div className="space-y-6">
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

              {pulsingEnabled && (
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
              )}

              <ResendSettings
                enabled={resendEnabled}
                onEnabledChange={setResendEnabled}
                daysAfter={resendDays}
                onDaysAfterChange={setResendDays}
              />
            </div>
          </div>

          <Separator />

          <div className="flex items-center justify-end gap-2 pt-1">
            <Button variant="outline" size="sm" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={() => {
                setOpen(false);
                setConfirmOpen(true);
              }}
            >
              {actionLabel}
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
