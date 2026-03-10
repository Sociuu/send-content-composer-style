import {
  GripVertical,
  Trash2,
  Image,
  Video,
  FileText,
  Type,
  Link2,
  Share2,
  Play,
  ExternalLink,
} from "lucide-react";
import type { ContentItem, SharableNetwork } from "@/types/content";
import NetworkToggles from "./NetworkToggles";

interface ContentCardProps {
  item: ContentItem;
  compact?: boolean;
  onRemove: (id: string) => void;
  onToggleNetwork: (contentId: string, networkId: string) => void;
  showDragHandle?: boolean;
}

const typeConfig = {
  image: { icon: Image, label: "Image", color: "text-sociuu-teal" },
  video: { icon: Video, label: "Video", color: "text-sociuu-teal" },
  document: { icon: FileText, label: "Document", color: "text-primary" },
  text: { icon: Type, label: "Text", color: "text-muted-foreground" },
  link: { icon: Link2, label: "Link", color: "text-accent" },
  social: { icon: Share2, label: "Social", color: "text-primary" },
};

const formatBadge = {
  native: { label: "Native", className: "bg-secondary text-secondary-foreground" },
  social: { label: "Social", className: "bg-sociuu-purple-light text-primary" },
};

const ContentCard = ({ item, compact, onRemove, onToggleNetwork }: ContentCardProps) => {
  const typeInfo = typeConfig[item.type];
  const TypeIcon = typeInfo.icon;
  const format = formatBadge[item.format];

  return (
    <div className="group relative rounded-xl border bg-card transition-all hover:border-primary/20 hover:compose-shadow">
      {/* Header: drag handle + meta + remove */}
      <div className="flex items-center gap-2 border-b px-3 py-2">
        <div className="cursor-grab text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 active:cursor-grabbing">
          <GripVertical className="h-4 w-4" />
        </div>

        <div className="flex flex-1 items-center gap-2 min-w-0">
          <TypeIcon className={`h-3.5 w-3.5 shrink-0 ${typeInfo.color}`} />
          <span className="truncate text-xs font-semibold text-foreground">
            {item.title}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <span className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${format.className}`}>
            {format.label}
          </span>
          <span className="rounded px-1.5 py-0.5 text-[10px] font-medium bg-secondary text-muted-foreground">
            {typeInfo.label}
          </span>
          <button
            onClick={() => onRemove(item.id)}
            className="ml-1 flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
            title="Remove from message"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Body: type-specific layout */}
      <div className={`px-3 ${compact ? "py-2" : "py-3"}`}>
        {item.type === "image" && (
          <div className="flex gap-3">
            {item.thumbnail && (
              <img
                src={item.thumbnail}
                alt={item.title}
                className={`shrink-0 rounded-lg object-cover ${compact ? "h-14 w-14" : "h-20 w-20"}`}
              />
            )}
            <p className={`text-xs leading-relaxed text-muted-foreground ${compact ? "line-clamp-2" : "line-clamp-3"}`}>
              {item.text}
            </p>
          </div>
        )}

        {item.type === "video" && (
          <div>
            <div className="relative mb-2 overflow-hidden rounded-lg">
              {item.thumbnail && (
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className={`w-full object-cover ${compact ? "h-24" : "h-32"}`}
                />
              )}
              <div className="absolute inset-0 flex items-center justify-center bg-foreground/20">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-card/90 backdrop-blur-sm">
                  <Play className="h-4 w-4 text-foreground ml-0.5" />
                </div>
              </div>
            </div>
            <p className={`text-xs leading-relaxed text-muted-foreground ${compact ? "line-clamp-2" : "line-clamp-3"}`}>
              {item.text}
            </p>
          </div>
        )}

        {item.type === "document" && (
          <div className="flex gap-3">
            {item.thumbnail ? (
              <img
                src={item.thumbnail}
                alt={item.title}
                className={`shrink-0 rounded-lg object-cover ${compact ? "h-14 w-14" : "h-16 w-16"}`}
              />
            ) : (
              <div className={`flex shrink-0 items-center justify-center rounded-lg bg-secondary ${compact ? "h-14 w-14" : "h-16 w-16"}`}>
                <FileText className="h-6 w-6 text-muted-foreground" />
              </div>
            )}
            <p className={`text-xs leading-relaxed text-muted-foreground ${compact ? "line-clamp-2" : "line-clamp-3"}`}>
              {item.text}
            </p>
          </div>
        )}

        {item.type === "text" && (
          <p className={`text-xs leading-relaxed text-muted-foreground ${compact ? "line-clamp-3" : "line-clamp-4"}`}>
            {item.text}
          </p>
        )}

        {item.type === "link" && (
          <div>
            <div className="mb-2 flex items-center gap-3 rounded-lg border bg-background p-2.5">
              {item.thumbnail && (
                <img
                  src={item.thumbnail}
                  alt={item.linkTitle || item.title}
                  className="h-12 w-12 shrink-0 rounded-md object-cover"
                />
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-medium text-foreground">
                  {item.linkTitle || item.title}
                </p>
                <p className="flex items-center gap-1 text-[10px] text-muted-foreground">
                  <ExternalLink className="h-2.5 w-2.5" />
                  {item.linkDomain}
                </p>
              </div>
            </div>
            <p className={`text-xs leading-relaxed text-muted-foreground ${compact ? "line-clamp-2" : "line-clamp-3"}`}>
              {item.text}
            </p>
          </div>
        )}

        {item.type === "social" && (
          <div>
            <div className="mb-2 rounded-lg border bg-background p-3">
              <div className="mb-2 flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <span className="text-[10px] font-bold">
                    {item.socialSource === "linkedin" ? "in" : "f"}
                  </span>
                </div>
                <div>
                  <p className="text-xs font-medium text-foreground">{item.socialAuthor}</p>
                  <p className="text-[10px] text-muted-foreground">{item.socialDate}</p>
                </div>
              </div>
              <p className={`text-xs leading-relaxed text-foreground ${compact ? "line-clamp-3" : "line-clamp-4"}`}>
                {item.text}
              </p>
              {item.thumbnail && (
                <img
                  src={item.thumbnail}
                  alt=""
                  className="mt-2 w-full rounded-md object-cover h-24"
                />
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer: network toggles */}
      <div className="border-t px-3 py-2">
        <NetworkToggles
          networks={item.networks}
          onToggle={(networkId) => onToggleNetwork(item.id, networkId)}
        />
      </div>
    </div>
  );
};

export default ContentCard;
