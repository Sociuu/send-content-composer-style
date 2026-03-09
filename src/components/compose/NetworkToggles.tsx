import type { SharableNetwork } from "@/types/content";

interface NetworkTogglesProps {
  networks: SharableNetwork[];
  onToggle: (networkId: string) => void;
}

const networkIcons: Record<string, { label: string; activeClass: string }> = {
  linkedin: { label: "in", activeClass: "bg-[hsl(210,80%,42%)] text-primary-foreground" },
  facebook: { label: "f", activeClass: "bg-[hsl(220,70%,45%)] text-primary-foreground" },
  x: { label: "𝕏", activeClass: "bg-foreground text-background" },
};

const NetworkToggles = ({ networks, onToggle }: NetworkTogglesProps) => {
  return (
    <div className="flex items-center gap-1.5">
      <span className="mr-1 text-[10px] text-muted-foreground">Share to</span>
      {networks.map((network) => {
        const config = networkIcons[network.id] || {
          label: network.name[0],
          activeClass: "bg-primary text-primary-foreground",
        };
        return (
          <button
            key={network.id}
            onClick={() => onToggle(network.id)}
            className={`flex h-6 w-6 items-center justify-center rounded-md text-[10px] font-bold transition-all ${
              network.enabled
                ? config.activeClass
                : "bg-secondary text-muted-foreground opacity-50 hover:opacity-75"
            }`}
            title={`${network.enabled ? "Disable" : "Enable"} ${network.name}`}
          >
            {config.label}
          </button>
        );
      })}
    </div>
  );
};

export default NetworkToggles;
