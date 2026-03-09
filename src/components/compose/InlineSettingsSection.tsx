import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import SendModeSettings, { type SendMode } from "./settings/SendModeSettings";
import RecipientFinalizationSettings, { type FinalizationMode } from "./settings/RecipientFinalizationSettings";
import PulsingSettings, { type PulsingMode, type TimeUnit } from "./settings/PulsingSettings";
import DeliveryWindowSettings from "./settings/DeliveryWindowSettings";
import ResendSettings from "./settings/ResendSettings";
import SendConfirmationDialog from "./settings/SendConfirmationDialog";
import type { ContentDistribution } from "./settings/ContentDistributionSettings";

interface InlineSettingsSectionProps {
  contentCount: number;
  hasGroupRecipients: boolean;
  contentDistribution: ContentDistribution;
}

const InlineSettingsSection = ({ contentCount, hasGroupRecipients, contentDistribution }: InlineSettingsSectionProps) => {
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
      <div className="mx-auto w-full max-w-2xl px-6 pb-6">
        <div className="rounded-xl border bg-card compose-shadow">
          <div className="px-5 py-4">
            <h3 className="text-xs font-semibold text-foreground mb-4">Send & Delivery</h3>

            <div className="grid grid-cols-2 gap-x-6 gap-y-5">
              <div className="space-y-5">
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

              <div className="space-y-5">
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

          <Separator />

          <div className="flex items-center justify-end gap-2 px-5 py-3">
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
    </>
  );
};

export default InlineSettingsSection;
