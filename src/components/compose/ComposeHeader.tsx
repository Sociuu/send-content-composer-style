import { ArrowLeft, Clock } from "lucide-react";

interface ComposeHeaderProps {
  draftStatus?: string;
  onBack?: () => void;
}

const ComposeHeader = ({ draftStatus = "Draft", onBack }: ComposeHeaderProps) => {
  return (
    <header className="flex items-center justify-between border-b px-6 py-3">
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div>
          <h1 className="text-sm font-semibold text-foreground">Compose Message</h1>
        </div>
      </div>

      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Clock className="h-3 w-3" />
        <span>{draftStatus}</span>
      </div>
    </header>
  );
};

export default ComposeHeader;
