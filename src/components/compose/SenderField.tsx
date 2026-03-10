import { Mail, Lock } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SenderFieldProps {
  senderName?: string;
  senderEmail?: string;
}

const SenderField = ({
  senderName = "Sociuu",
  senderEmail = "noreply@sociuu.com",
}: SenderFieldProps) => {
  return (
    <div className="flex items-center gap-2 border-b px-0 py-3">
      <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground whitespace-nowrap">
        <Mail className="h-3.5 w-3.5" />
        From
      </span>
      <div className="flex flex-1 items-center gap-2">
        <span className="text-sm text-foreground">{senderName}</span>
        <span className="text-xs text-muted-foreground">&lt;{senderEmail}&gt;</span>
      </div>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-1 rounded-md bg-secondary px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
            <Lock className="h-2.5 w-2.5" />
            Fixed
          </div>
        </TooltipTrigger>
        <TooltipContent side="left" className="max-w-xs">
          <p className="text-[11px]">
            Sender address is configured by your organization's mail security policy and cannot be changed.
          </p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
};

export default SenderField;
