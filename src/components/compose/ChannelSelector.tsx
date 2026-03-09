import { Mail, Hash, Slack } from "lucide-react";

type Channel = "email" | "slack" | "teams";

interface ChannelSelectorProps {
  selected: Channel;
  onChange: (channel: Channel) => void;
}

const channels: { id: Channel; label: string; icon: React.ReactNode }[] = [
  { id: "email", label: "Email", icon: <Mail className="h-3.5 w-3.5" /> },
  { id: "slack", label: "Slack", icon: <Slack className="h-3.5 w-3.5" /> },
  { id: "teams", label: "Teams", icon: <Hash className="h-3.5 w-3.5" /> },
];

const ChannelSelector = ({ selected, onChange }: ChannelSelectorProps) => {
  return (
    <div className="flex items-center gap-0.5 rounded-lg bg-secondary p-0.5">
      {channels.map((ch) => (
        <button
          key={ch.id}
          onClick={() => onChange(ch.id)}
          className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
            selected === ch.id
              ? "bg-card text-foreground compose-shadow"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {ch.icon}
          {ch.label}
        </button>
      ))}
    </div>
  );
};

export default ChannelSelector;
