import { useState, useCallback } from "react";
import ComposeHeader, { generateDefaultTitle } from "@/components/compose/ComposeHeader";
import ChannelSelector from "@/components/compose/ChannelSelector";
import RecipientField from "@/components/compose/RecipientField";
import ComposeField from "@/components/compose/ComposeField";
import BodyEditor from "@/components/compose/BodyEditor";
import FooterEditor from "@/components/compose/FooterEditor";
import ContentPanel from "@/components/compose/ContentPanel";
import InlineContentArea from "@/components/compose/InlineContentArea";
import SendingDeliveryPanel from "@/components/compose/SendingDeliveryPanel";
import ConfigureSendModal from "@/components/compose/ConfigureSendModal";
import PreviewActions from "@/components/compose/PreviewActions";
import EmailPreviewModal from "@/components/compose/EmailPreviewModal";
import { Paperclip, ArrowRight, AlertCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { mockContentItems, type ContentItem } from "@/types/content";
import type { ContentDistribution } from "@/components/compose/settings/ContentDistributionSettings";
import type { ContentAccessMode } from "@/components/compose/ContentPanel";
import type { SendMode } from "@/components/compose/settings/SendModeSettings";
import type { FinalizationMode } from "@/components/compose/settings/RecipientFinalizationSettings";
import type { PulsingMode, TimeUnit } from "@/components/compose/settings/PulsingSettings";
import type { TrackingConfig, ContentTrackingOverride } from "@/components/compose/settings/LinkTrackingSettings";
import { EMPTY_TRACKING, DEFAULT_TRACKING } from "@/components/compose/settings/LinkTrackingSettings";

const ComposePage = () => {
  const [channel, setChannel] = useState<"email" | "slack" | "teams">("email");
  const [recipients, setRecipients] = useState<string[]>(["Marketing Team"]);
  const [messageTitle, setMessageTitle] = useState(() => generateDefaultTitle());
  const [subject, setSubject] = useState("");
  const [preview, setPreview] = useState("");
  const [body, setBody] = useState("");
  const [footer, setFooter] = useState("");
  const [showContentPanel, setShowContentPanel] = useState(true);
  const [contentItems, setContentItems] = useState<ContentItem[]>(mockContentItems);
  const [contentDistribution, setContentDistribution] = useState<ContentDistribution>("manual");
  const [showEmailPreview, setShowEmailPreview] = useState(false);
  const [contentAccessMode, setContentAccessMode] = useState<ContentAccessMode>("available");

  // Sending & Delivery state (persists with draft)
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
  const [deliveryWindowEnabled, setDeliveryWindowEnabled] = useState(true);
  const [allowedDays, setAllowedDays] = useState<string[]>(["mon", "tue", "wed", "thu", "fri"]);
  const [windowStartTime, setWindowStartTime] = useState("08:00");
  const [windowEndTime, setWindowEndTime] = useState("17:00");
  const [windowTimezone, setWindowTimezone] = useState("Europe/Copenhagen");
  const [resendEnabled, setResendEnabled] = useState(false);
  const [resendDays, setResendDays] = useState(3);

  // Link tracking state
  const [trackingConfig, setTrackingConfig] = useState<TrackingConfig>(DEFAULT_TRACKING);
  const [contentTrackingOverrides, setContentTrackingOverrides] = useState<Record<string, ContentTrackingOverride>>({});

  // Review & Send modal
  const [showReviewModal, setShowReviewModal] = useState(false);

  const handleRemoveContent = useCallback((id: string) => {
    setContentItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const handleToggleNetwork = useCallback((contentId: string, networkId: string) => {
    setContentItems((prev) =>
      prev.map((item) =>
        item.id === contentId
          ? {
              ...item,
              networks: item.networks.map((n) =>
                n.id === networkId ? { ...n, enabled: !n.enabled } : n
              ),
            }
          : item
      )
    );
  }, []);

  const handleContentTrackingOverrideChange = useCallback((contentId: string, override: ContentTrackingOverride) => {
    setContentTrackingOverrides((prev) => ({ ...prev, [contentId]: override }));
  }, []);

  // Validation
  const missingFields: string[] = [];
  if (recipients.length === 0) missingFields.push("Recipients");
  if (channel === "email" && !subject.trim()) missingFields.push("Subject");
  if (!body.trim()) missingFields.push("Body");
  if (sendMode === "schedule" && !scheduleDate) missingFields.push("Schedule date");

  const canSend = missingFields.length === 0;

  return (
    <div className="flex h-screen flex-col bg-background">
      <ComposeHeader draftStatus="Draft saved 2 min ago" title={messageTitle} onTitleChange={setMessageTitle} />

      <div className="flex flex-1 overflow-hidden">
        {/* Main Compose Area */}
        <div className="flex flex-1 flex-col">
          <div className="flex-1 overflow-y-auto">
            <div className="mx-auto w-full max-w-2xl px-6 py-5">
              {/* Channel Selector */}
              <div className="mb-5 flex items-center justify-between">
                <ChannelSelector selected={channel} onChange={setChannel} />
                <button
                  onClick={() => setShowContentPanel(!showContentPanel)}
                  className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                >
                  <Paperclip className="h-3.5 w-3.5" />
                  Content
                  {contentItems.length > 0 && (
                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                      {contentItems.length}
                    </span>
                  )}
                </button>
              </div>

              {/* Compose Card */}
              <div className="rounded-xl border bg-card compose-shadow">
                <div className="px-5">
                  <RecipientField />
                  {channel === "email" && (
                    <>
                      <ComposeField
                        label="Subject"
                        placeholder="Enter email subject..."
                        value={subject}
                        onChange={setSubject}
                      />
                      <ComposeField
                        label="Preview"
                        placeholder="Preview text shown in inbox..."
                        value={preview}
                        onChange={setPreview}
                        small
                      />
                    </>
                  )}
                </div>

                <div className="px-5">
                  <BodyEditor value={body} onChange={setBody} />
                </div>

                <div className="px-5 pb-4">
                  <FooterEditor value={footer} onChange={setFooter} />
                </div>

                {/* Preview actions for email */}
                {channel === "email" && (
                  <div className="border-t px-5 py-2.5">
                    <PreviewActions onViewPreview={() => setShowEmailPreview(true)} />
                  </div>
                )}
              </div>
            </div>

            {/* Sending & Delivery Panel — below compose card */}
            <SendingDeliveryPanel
              sendMode={sendMode}
              onSendModeChange={setSendMode}
              scheduleDate={scheduleDate}
              onScheduleDateChange={setScheduleDate}
              scheduleTime={scheduleTime}
              onScheduleTimeChange={setScheduleTime}
              timezone={timezone}
              onTimezoneChange={setTimezone}
              hasGroupRecipients={true}
              finalizationMode={finalizationMode}
              onFinalizationModeChange={setFinalizationMode}
              removeDropped={removeDropped}
              onRemoveDroppedChange={setRemoveDropped}
              pulsingEnabled={pulsingEnabled}
              onPulsingEnabledChange={setPulsingEnabled}
              pulsingMode={pulsingMode}
              onPulsingModeChange={setPulsingMode}
              rateCount={rateCount}
              onRateCountChange={setRateCount}
              rateUnit={rateUnit}
              onRateUnitChange={setRateUnit}
              distributeDuration={distributeDuration}
              onDistributeDurationChange={setDistributeDuration}
              distributeUnit={distributeUnit}
              onDistributeUnitChange={setDistributeUnit}
              deliveryWindowEnabled={deliveryWindowEnabled}
              onDeliveryWindowEnabledChange={setDeliveryWindowEnabled}
              allowedDays={allowedDays}
              onAllowedDaysChange={setAllowedDays}
              windowStartTime={windowStartTime}
              onWindowStartTimeChange={setWindowStartTime}
              windowEndTime={windowEndTime}
              onWindowEndTimeChange={setWindowEndTime}
              windowTimezone={windowTimezone}
              onWindowTimezoneChange={setWindowTimezone}
              resendEnabled={resendEnabled}
              onResendEnabledChange={setResendEnabled}
              resendDays={resendDays}
              onResendDaysChange={setResendDays}
            />
          </div>

          {/* Bottom action bar */}
          <div className="border-t bg-card">
            <div className="flex items-center justify-between px-6 py-3">
              <div />
              <div className="flex items-center gap-2">
                <button className="rounded-lg px-4 py-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
                  Save Draft
                </button>
                <button
                  onClick={() => setShowReviewModal(true)}
                  className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2 text-xs font-semibold text-primary-foreground transition-all hover:opacity-90"
                >
                  Review & Send
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right panel — Content */}
        <ContentPanel
          visible={showContentPanel}
          onClose={() => setShowContentPanel(false)}
          items={contentItems}
          onRemove={handleRemoveContent}
          onToggleNetwork={handleToggleNetwork}
          contentDistribution={contentDistribution}
          onContentDistributionChange={setContentDistribution}
          contentAccessMode={contentAccessMode}
          onContentAccessModeChange={setContentAccessMode}
          trackingConfig={trackingConfig}
          onTrackingConfigChange={setTrackingConfig}
          contentTrackingOverrides={contentTrackingOverrides}
          onContentTrackingOverrideChange={handleContentTrackingOverrideChange}
        />
      </div>

      {/* Email Preview Modal */}
      <EmailPreviewModal
        open={showEmailPreview}
        onOpenChange={setShowEmailPreview}
        subject={subject}
        body={body}
        footer={footer}
        contentItems={contentItems}
      />
    </div>
  );
};

export default ComposePage;
