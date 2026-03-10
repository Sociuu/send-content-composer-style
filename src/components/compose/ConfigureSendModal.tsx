import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Zap,
  CalendarClock,
  Timer,
  Clock,
  RotateCcw,
  Users,
  Mail,
  MessageSquare,
  Hash,
  Paperclip,
  Shuffle,
  SplitSquareHorizontal,
  List,
  Link2,
  Eye,
  FileText,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { format } from "date-fns";
import type { SendMode } from "./settings/SendModeSettings";
import type { FinalizationMode } from "./settings/RecipientFinalizationSettings";
import type { PulsingMode, TimeUnit } from "./settings/PulsingSettings";
import type { ContentDistribution } from "./settings/ContentDistributionSettings";
import type { TrackingConfig } from "./settings/LinkTrackingSettings";
import type { ContentAccessMode } from "./ContentPanel";

interface ReviewSendModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;

  // Message
  channel: "email" | "slack" | "teams";
  messageTitle: string;
  subject: string;
  previewText: string;
  bodyLength: number;
  footerLength: number;

  // Recipients
  recipients: string[];

  // Content
  contentCount: number;
  contentDistribution: ContentDistribution;
  contentAccessMode: ContentAccessMode;

  // Sending
  sendMode: SendMode;
  scheduleDate?: Date;
  scheduleTime: string;
  timezone: string;

  // Recipient finalization
  hasGroupRecipients: boolean;
  finalizationMode: FinalizationMode;

  // Pulsing
  pulsingEnabled: boolean;
  pulsingMode: PulsingMode;
  rateCount: number;
  rateUnit: TimeUnit;
  distributeDuration: number;
  distributeUnit: TimeUnit;

  // Delivery window
  deliveryWindowEnabled: boolean;
  allowedDays: string[];
  windowStartTime: string;
  windowEndTime: string;

  // Resend
  resendEnabled: boolean;
  resendDays: number;

  // Tracking
  trackingConfig: TrackingConfig;
}

const DAY_LABELS: Record<string, string> = {
  mon: "Mon", tue: "Tue", wed: "Wed", thu: "Thu", fri: "Fri", sat: "Sat", sun: "Sun",
};

const CHANNEL_CONFIG = {
  email: { icon: Mail, label: "Email" },
  slack: { icon: Hash, label: "Slack" },
  teams: { icon: MessageSquare, label: "Teams" },
};

// ─── Review Section ───
const ReviewSection = ({
  icon: Icon,
  title,
  children,
  status = "ok",
}: {
  icon: typeof Clock;
  title: string;
  children: React.ReactNode;
  status?: "ok" | "warn" | "info";
}) => (
  <div className="group">
    <div className="flex items-start gap-3 py-3">
      <div className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${
        status === "warn" ? "bg-destructive/10" : "bg-primary/10"
      }`}>
        <Icon className={`h-3.5 w-3.5 ${status === "warn" ? "text-destructive" : "text-primary"}`} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground mb-1">{title}</p>
        <div className="text-sm text-foreground">{children}</div>
      </div>
    </div>
  </div>
);

const ReviewValue = ({ label, value, mono }: { label: string; value: string; mono?: boolean }) => (
  <div className="flex items-baseline justify-between gap-4 py-0.5">
    <span className="text-xs text-muted-foreground shrink-0">{label}</span>
    <span className={`text-xs font-medium text-foreground text-right truncate ${mono ? "font-mono" : ""}`}>{value}</span>
  </div>
);

const Tag = ({ children, variant = "default" }: { children: React.ReactNode; variant?: "default" | "muted" }) => (
  <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-medium ${
    variant === "muted"
      ? "bg-secondary text-secondary-foreground"
      : "bg-primary/10 text-primary"
  }`}>
    {children}
  </span>
);

const ConfigureSendModal = ({
  open,
  onOpenChange,
  onConfirm,
  channel,
  messageTitle,
  subject,
  previewText,
  bodyLength,
  footerLength,
  recipients,
  contentCount,
  contentDistribution,
  contentAccessMode,
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
  resendEnabled,
  resendDays,
  trackingConfig,
}: ReviewSendModalProps) => {
  const ChannelIcon = CHANNEL_CONFIG[channel].icon;
  const actionLabel = sendMode === "now" ? "Send Now" : "Schedule Send";
  const trackingEnabled = trackingConfig.params.length > 0;
  const trackingParamCount = trackingConfig.params.filter((p) => p.key && p.value).length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg p-0 gap-0">
        {/* Header */}
        <DialogHeader className="sticky top-0 z-10 border-b bg-card px-6 py-4">
          <DialogTitle className="text-sm font-semibold">Review & Send</DialogTitle>
          <p className="text-[11px] text-muted-foreground">
            Review your message details before sending.
          </p>
        </DialogHeader>

        {/* Review sections */}
        <div className="px-6 py-2 divide-y divide-border">
          {/* Message overview */}
          <ReviewSection icon={FileText} title="Message">
            <div className="space-y-0.5">
              <ReviewValue label="Title" value={messageTitle} />
              <ReviewValue label="Channel" value={CHANNEL_CONFIG[channel].label} />
              {channel === "email" && (
                <ReviewValue
                  label="Subject"
                  value={subject ? `✓ ${subject.length > 40 ? subject.slice(0, 40) + "…" : subject}` : "—"}
                />
              )}
              {channel === "email" && (
                <ReviewValue
                  label="Preview text"
                  value={previewText ? "✓ Added" : "— Not set"}
                />
              )}
              <ReviewValue label="Body" value={bodyLength > 0 ? `✓ ${bodyLength} chars` : "— Empty"} />
              <ReviewValue label="Footer" value={footerLength > 0 ? "✓ Added" : "— Not set"} />
            </div>
          </ReviewSection>

          {/* Recipients */}
          <ReviewSection icon={Users} title="Recipients">
            <div className="flex flex-wrap gap-1.5">
              {recipients.map((r) => (
                <Tag key={r} variant="muted">{r}</Tag>
              ))}
            </div>
          </ReviewSection>

          {/* Content */}
          {contentCount > 0 && (
            <ReviewSection icon={Paperclip} title="Content">
              <div className="space-y-0.5">
                <ReviewValue label="Items" value={`${contentCount} content item${contentCount !== 1 ? "s" : ""}`} />
                <ReviewValue
                  label="Distribution"
                  value={
                    contentDistribution === "randomize"
                      ? "Randomized order"
                      : contentDistribution === "split"
                      ? "Split send (one per recipient)"
                      : "Manual order"
                  }
                />
                <ReviewValue
                  label="Access"
                  value={contentAccessMode === "available" ? "Send available" : "Grant access to all"}
                />
              </div>
            </ReviewSection>
          )}

          {/* Delivery */}
          <ReviewSection
            icon={sendMode === "now" ? Zap : CalendarClock}
            title="Delivery"
          >
            <div className="space-y-0.5">
              <ReviewValue
                label="When"
                value={
                  sendMode === "now"
                    ? "Send immediately"
                    : `${scheduleDate ? format(scheduleDate, "MMM d, yyyy") : "—"} at ${scheduleTime} (${timezone})`
                }
              />
              {sendMode === "schedule" && hasGroupRecipients && (
                <ReviewValue
                  label="Finalization"
                  value={finalizationMode === "at-send-time" ? "At send time" : "Locked at schedule time"}
                />
              )}
            </div>
          </ReviewSection>

          {/* Pulsing & Delivery window */}
          {(pulsingEnabled || deliveryWindowEnabled) && (
            <ReviewSection icon={Timer} title="Throttling">
              <div className="space-y-0.5">
                {pulsingEnabled && (
                  <ReviewValue
                    label="Pulsing"
                    value={
                      pulsingMode === "rate"
                        ? `${rateCount} per ${rateUnit}`
                        : `Over ${distributeDuration} ${distributeUnit}`
                    }
                  />
                )}
                {deliveryWindowEnabled && (
                  <>
                    <ReviewValue
                      label="Window"
                      value={`${windowStartTime}–${windowEndTime}`}
                    />
                    <ReviewValue
                      label="Days"
                      value={allowedDays.map((d) => DAY_LABELS[d] || d).join(", ")}
                    />
                  </>
                )}
              </div>
            </ReviewSection>
          )}

          {/* Resend */}
          {resendEnabled && (
            <ReviewSection icon={RotateCcw} title="Resend">
              <ReviewValue
                label="Non-openers"
                value={`After ${resendDays} day${resendDays !== 1 ? "s" : ""}`}
              />
            </ReviewSection>
          )}

          {/* Link tracking */}
          <ReviewSection icon={Link2} title="Link Tracking">
            <ReviewValue
              label="Status"
              value={trackingEnabled ? `Enabled · ${trackingParamCount} parameter${trackingParamCount !== 1 ? "s" : ""}` : "Disabled"}
            />
          </ReviewSection>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 flex items-center justify-between border-t bg-card px-6 py-3">
          <button
            onClick={() => onOpenChange(false)}
            className="rounded-lg px-4 py-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            Go Back
          </button>
          <Button
            size="sm"
            onClick={onConfirm}
            className="gap-1.5"
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
            {actionLabel}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConfigureSendModal;
