import { Settings2, ChevronUp } from "lucide-react";
import { useState } from "react";
import SendModeSettings, { type SendMode } from "./settings/SendModeSettings";
import RecipientFinalizationSettings, { type FinalizationMode } from "./settings/RecipientFinalizationSettings";
import PulsingSettings, { type PulsingMode, type TimeUnit } from "./settings/PulsingSettings";
import DeliveryWindowSettings from "./settings/DeliveryWindowSettings";
import ContentDistributionSettings, { type ContentDistribution } from "./settings/ContentDistributionSettings";
import ResendSettings from "./settings/ResendSettings";
import SendConfirmationDialog from "./settings/SendConfirmationDialog";

interface SendingDrawerProps {
  contentCount: number;
  hasGroupRecipients: boolean;
}

const SendingDrawer = ({ contentCount, hasGroupRecipients }: SendingDrawerProps) => {
  const [expanded, setExpanded] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  // Send mode
  const [sendMode, setSendMode] = useState<SendMode>("now");
  const [scheduleDate, setScheduleDate] = useState<Date | undefined>();
  const [scheduleTime, setScheduleTime] = useState("09:00");
  const [timezone, setTimezone] = useState("Europe/Copenhagen");

  // Recipient finalization
  const [finalizationMode, setFinalizationMode] = useState<FinalizationMode>("at-send-time");
  const [removeDropped, setRemoveDropped] = useState(false);

  // Pulsing
  const [pulsingEnabled, setPulsingEnabled] = useState(false);
  const [pulsingMode, setPulsingMode] = useState<PulsingMode>("rate");
  const [rateCount, setRateCount] = useState(50);
  const [rateUnit, setRateUnit] = useState<TimeUnit>("hours");
  const [distributeDuration, setDistributeDuration] = useState(4);
  const [distributeUnit, setDistributeUnit] = useState<TimeUnit>("hours");

  // Delivery window
  const [deliveryWindowEnabled, setDeliveryWindowEnabled] = useState(false);
  const [allowedDays, setAllowedDays] = useState<string[]>(["mon", "tue", "wed", "thu", "fri"]);
  const [windowStartTime, setWindowStartTime] = useState("08:00");
  const [windowEndTime, setWindowEndTime] = useState("17:00");
  const [windowTimezone, setWindowTimezone] = useState("Europe/Copenhagen");

  // Content distribution
  const [contentDistribution, setContentDistribution] = useState<ContentDistribution>("manual");

  // Resend
  const [resendEnabled, setResendEnabled] = useState(false);
  const [resendDays, setResendDays] = useState(3);

  const actionLabel = sendMode === "now" ? "Send Message" : "Schedule Message";

  return (
    <div className="border-t bg-card">
      {expanded && (
        <div className="border-b px-6 py-4">
          <div className="mx-auto grid max-w-3xl grid-cols-2 gap-x-8 gap-y-6">
            {/* Left column */}
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

              <ContentDistributionSettings
                distribution={contentDistribution}
                onDistributionChange={setContentDistribution}
                contentCount={contentCount}
              />
            </div>

            {/* Right column */}
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
        </div>
      )}

      {/* Action Bar */}
      <div className="flex items-center justify-between px-6 py-3">
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <Settings2 className="h-3.5 w-3.5" />
          Settings
          <ChevronUp
            className={`h-3 w-3 transition-transform ${expanded ? "" : "rotate-180"}`}
          />
        </button>

        <div className="flex items-center gap-2">
          <button className="rounded-lg px-4 py-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
            Save Draft
          </button>
          <button
            onClick={() => setConfirmOpen(true)}
            className="rounded-lg bg-primary px-5 py-2 text-xs font-semibold text-primary-foreground transition-all hover:opacity-90"
          >
            {actionLabel}
          </button>
        </div>
      </div>

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
    </div>
  );
};

export default SendingDrawer;
