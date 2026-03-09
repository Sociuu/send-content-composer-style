import { useState, useCallback } from "react";
import ComposeHeader from "@/components/compose/ComposeHeader";
import ChannelSelector from "@/components/compose/ChannelSelector";
import RecipientField from "@/components/compose/RecipientField";
import ComposeField from "@/components/compose/ComposeField";
import BodyEditor from "@/components/compose/BodyEditor";
import FooterEditor from "@/components/compose/FooterEditor";
import ContentPanel from "@/components/compose/ContentPanel";
import InlineContentArea from "@/components/compose/InlineContentArea";
import InlineSettingsSection from "@/components/compose/InlineSettingsSection";
import SendingDrawer from "@/components/compose/SendingDrawer";
import ConfigureSendModal from "@/components/compose/ConfigureSendModal";
import PreSendChecklistPanel from "@/components/compose/PreSendChecklistPanel";
import PreviewActions from "@/components/compose/PreviewActions";
import EmailPreviewModal from "@/components/compose/EmailPreviewModal";
import { Paperclip } from "lucide-react";
import { cn } from "@/lib/utils";
import { mockContentItems, type ContentItem } from "@/types/content";
import type { ContentDistribution } from "@/components/compose/settings/ContentDistributionSettings";

type LayoutVariant = "drawer" | "modal" | "inline" | "checklist" | "inline-content";

const VARIANTS: { key: LayoutVariant; label: string }[] = [
  { key: "drawer", label: "A: Drawer" },
  { key: "modal", label: "B: Modal" },
  { key: "inline", label: "C: Inline" },
  { key: "checklist", label: "D: Checklist" },
  { key: "inline-content", label: "E: Inline Content" },
];

const ComposePage = () => {
  const [channel, setChannel] = useState<"email" | "slack" | "teams">("email");
  const [subject, setSubject] = useState("");
  const [preview, setPreview] = useState("");
  const [body, setBody] = useState("");
  const [footer, setFooter] = useState("");
  const [showContentPanel, setShowContentPanel] = useState(true);
  const [showChecklistPanel, setShowChecklistPanel] = useState(false);
  const [contentItems, setContentItems] = useState<ContentItem[]>(mockContentItems);
  const [contentDistribution, setContentDistribution] = useState<ContentDistribution>("manual");
  const [variant, setVariant] = useState<LayoutVariant>("drawer");
  const [showEmailPreview, setShowEmailPreview] = useState(false);

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

  // For checklist variant, clicking "Send" opens checklist panel instead of content panel
  const handleChecklistSend = () => {
    setShowChecklistPanel(true);
    setShowContentPanel(false);
  };

  return (
    <div className="flex h-screen flex-col bg-background">
      <ComposeHeader draftStatus="Draft saved 2 min ago" />

      {/* Variant Switcher */}
      <div className="border-b bg-secondary/50 px-6 py-1.5">
        <div className="mx-auto flex max-w-4xl items-center gap-1">
          <span className="mr-2 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
            Layout variant:
          </span>
          {VARIANTS.map((v) => (
            <button
              key={v.key}
              onClick={() => {
                setVariant(v.key);
                setShowChecklistPanel(false);
              }}
              className={cn(
                "rounded-md px-2.5 py-1 text-[11px] font-medium transition-all",
                variant === v.key
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
            >
              {v.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Main Compose Area */}
        <div className="flex flex-1 flex-col">
          <div className="flex-1 overflow-y-auto">
            <div className="mx-auto w-full max-w-2xl px-6 py-5">
              {/* Channel Selector */}
              <div className="mb-5 flex items-center justify-between">
                <ChannelSelector selected={channel} onChange={setChannel} />
                <button
                  onClick={() => {
                    setShowContentPanel(!showContentPanel);
                    setShowChecklistPanel(false);
                  }}
                  className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                >
                  <Paperclip className="h-3.5 w-3.5" />
                  Panel
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

                {/* Inline Content Area */}
                <div className="px-5 pb-5">
                  <InlineContentArea
                    items={contentItems}
                    onRemove={handleRemoveContent}
                    onToggleNetwork={handleToggleNetwork}
                  />
                </div>
              </div>
            </div>

            {/* Variant C: Inline settings section below compose card */}
            {variant === "inline" && (
              <InlineSettingsSection
                contentCount={contentItems.length}
                hasGroupRecipients={true}
                contentDistribution={contentDistribution}
              />
            )}
          </div>

          {/* Variant A: Bottom drawer */}
          {variant === "drawer" && (
            <SendingDrawer contentCount={contentItems.length} hasGroupRecipients={true} />
          )}

          {/* Variant B: Modal triggered from bottom bar */}
          {variant === "modal" && (
            <ConfigureSendModal
              contentCount={contentItems.length}
              hasGroupRecipients={true}
              contentDistribution={contentDistribution}
            />
          )}

          {/* Variant D: Bottom bar with "Configure & Send" that opens checklist panel */}
          {variant === "checklist" && (
            <div className="border-t bg-card">
              <div className="flex items-center justify-between px-6 py-3">
                <div />
                <div className="flex items-center gap-2">
                  <button className="rounded-lg px-4 py-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
                    Save Draft
                  </button>
                  <button
                    onClick={handleChecklistSend}
                    className="rounded-lg bg-primary px-5 py-2 text-xs font-semibold text-primary-foreground transition-all hover:opacity-90"
                  >
                    Configure & Send →
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right panels */}
        {variant === "checklist" && showChecklistPanel ? (
          <PreSendChecklistPanel
            visible={true}
            onClose={() => {
              setShowChecklistPanel(false);
              setShowContentPanel(true);
            }}
            contentCount={contentItems.length}
            hasGroupRecipients={true}
            contentDistribution={contentDistribution}
          />
        ) : (
          <ContentPanel
            visible={showContentPanel}
            onClose={() => setShowContentPanel(false)}
            items={contentItems}
            onRemove={handleRemoveContent}
            onToggleNetwork={handleToggleNetwork}
            contentDistribution={contentDistribution}
            onContentDistributionChange={setContentDistribution}
          />
        )}
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
