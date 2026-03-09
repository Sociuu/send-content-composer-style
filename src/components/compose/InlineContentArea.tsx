import ContentCard from "./ContentCard";
import type { ContentItem } from "@/types/content";

interface InlineContentAreaProps {
  items: ContentItem[];
  onRemove: (id: string) => void;
  onToggleNetwork: (contentId: string, networkId: string) => void;
}

const InlineContentArea = ({ items, onRemove, onToggleNetwork }: InlineContentAreaProps) => {
  if (items.length === 0) return null;

  return (
    <div className="border-t pt-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-xs font-semibold text-foreground">
          Content
          <span className="ml-1.5 text-muted-foreground font-normal">
            {items.length} {items.length === 1 ? "item" : "items"}
          </span>
        </h3>
      </div>
      <div className="space-y-3">
        {items.map((item) => (
          <ContentCard
            key={item.id}
            item={item}
            onRemove={onRemove}
            onToggleNetwork={onToggleNetwork}
          />
        ))}
      </div>
    </div>
  );
};

export default InlineContentArea;
