import { Image, FileText, Link, Plus, X, GripVertical } from "lucide-react";

interface ContentPanelProps {
  visible: boolean;
  onClose: () => void;
}

const mockContent = [
  { id: "1", type: "article", title: "Q1 Company Update", source: "Blog" },
  { id: "2", type: "image", title: "Brand Campaign Visual", source: "Assets" },
];

const ContentPanel = ({ visible, onClose }: ContentPanelProps) => {
  if (!visible) return null;

  return (
    <div className="w-[320px] shrink-0 border-l bg-card">
      <div className="flex items-center justify-between border-b px-4 py-3">
        <h3 className="text-xs font-semibold text-foreground">Selected Content</h3>
        <button
          onClick={onClose}
          className="flex h-6 w-6 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="p-4">
        <div className="space-y-2">
          {mockContent.map((item) => (
            <div
              key={item.id}
              className="group flex items-start gap-2 rounded-lg border border-sociuu-border-subtle bg-background p-3 transition-colors hover:border-border"
            >
              <GripVertical className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-secondary">
                {item.type === "article" ? (
                  <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                ) : (
                  <Image className="h-3.5 w-3.5 text-muted-foreground" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-medium text-foreground">{item.title}</p>
                <p className="text-[10px] text-muted-foreground">{item.source}</p>
              </div>
              <button className="shrink-0 text-muted-foreground transition-colors hover:text-destructive">
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>

        <button className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-border py-2.5 text-xs font-medium text-muted-foreground transition-colors hover:border-primary hover:text-primary">
          <Plus className="h-3.5 w-3.5" />
          Add Content
        </button>
      </div>
    </div>
  );
};

export default ContentPanel;
