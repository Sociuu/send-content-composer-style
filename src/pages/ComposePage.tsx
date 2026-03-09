import { useState, useCallback } from "react";
import ComposeHeader from "@/components/compose/ComposeHeader";
import ChannelSelector from "@/components/compose/ChannelSelector";
import RecipientField from "@/components/compose/RecipientField";
import ComposeField from "@/components/compose/ComposeField";
import BodyEditor from "@/components/compose/BodyEditor";
import FooterEditor from "@/components/compose/FooterEditor";
import ContentPanel from "@/components/compose/ContentPanel";
import InlineContentArea from "@/components/compose/InlineContentArea";
import SendingDrawer from "@/components/compose/SendingDrawer";
import { Paperclip } from "lucide-react";
import { mockContentItems, type ContentItem } from "@/types/content";

const ComposePage = () => {
  const [channel, setChannel] = useState<"email" | "slack" | "teams">("email");
  const [subject, setSubject] = useState("");
  const [preview, setPreview] = useState("");
  const [body, setBody] = useState("");
  const [footer, setFooter] = useState("");
  const [showContentPanel, setShowContentPanel] = useState(true);
  const [contentItems, setContentItems] = useState<ContentItem[]>(mockContentItems);

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

  return (
    <div className="flex h-screen flex-col bg-background">
      <ComposeHeader draftStatus="Draft saved 2 min ago" />

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
          </div>

          {/* Bottom Sending Drawer */}
          <SendingDrawer />
        </div>

        {/* Right Content Panel */}
        <ContentPanel
          visible={showContentPanel}
          onClose={() => setShowContentPanel(false)}
          items={contentItems}
          onRemove={handleRemoveContent}
          onToggleNetwork={handleToggleNetwork}
        />
      </div>
    </div>
  );
};

export default ComposePage;
