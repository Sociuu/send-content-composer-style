import { X } from "lucide-react";
import ContentCard from "./ContentCard";
import type { ContentItem } from "@/types/content";

interface ContentPanelProps {
  visible: boolean;
  onClose: () => void;
  items: ContentItem[];
  onRemove: (id: string) => void;
  onToggleNetwork: (contentId: string, networkId: string) => void;
}

const ContentPanel = ({ visible, onClose, items, onRemove, onToggleNetwork }: ContentPanelProps) => {
  if (!visible) return null;

  return (
    <div className="w-[360px] shrink-0 border-l bg-card overflow-y-auto">
      <div className="flex items-center justify-between border-b px-4 py-3 sticky top-0 bg-card z-10">
        <h3 className="text-xs font-semibold text-foreground">
          Selected Content
          <span className="ml-1.5 font-normal text-muted-foreground">
            {items.length}
          </span>
        </h3>
        <button
          onClick={onClose}
          className="flex h-6 w-6 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="p-3 space-y-3">
        {items.map((item) => (
          <ContentCard
            key={item.id}
            item={item}
            compact
            onRemove={onRemove}
            onToggleNetwork={onToggleNetwork}
          />
        ))}
      </div>
    </div>
  );
};

export default ContentPanel;
