import { Settings2, BarChart3, ChevronUp } from "lucide-react";
import { useState } from "react";

const SendingDrawer = () => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="border-t bg-card">
      {expanded && (
        <div className="border-b px-6 py-4">
          <div className="mx-auto grid max-w-2xl grid-cols-2 gap-6">
            {/* Sending/Delivery Settings */}
            <div>
              <h4 className="mb-3 flex items-center gap-1.5 text-xs font-semibold text-foreground">
                <Settings2 className="h-3.5 w-3.5 text-muted-foreground" />
                Sending & Delivery
              </h4>
              <div className="space-y-3">
                <div>
                  <label className="mb-1 block text-[11px] font-medium text-muted-foreground">
                    Send Window
                  </label>
                  <select className="w-full rounded-md border bg-background px-2.5 py-1.5 text-xs text-foreground outline-none focus:ring-1 focus:ring-ring">
                    <option>Immediately</option>
                    <option>Business hours only</option>
                    <option>Custom schedule</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-[11px] font-medium text-muted-foreground">
                    Delivery Priority
                  </label>
                  <select className="w-full rounded-md border bg-background px-2.5 py-1.5 text-xs text-foreground outline-none focus:ring-1 focus:ring-ring">
                    <option>Normal</option>
                    <option>High</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Tracking/UTM Settings */}
            <div>
              <h4 className="mb-3 flex items-center gap-1.5 text-xs font-semibold text-foreground">
                <BarChart3 className="h-3.5 w-3.5 text-muted-foreground" />
                Tracking & UTM
              </h4>
              <div className="space-y-3">
                <div>
                  <label className="mb-1 block text-[11px] font-medium text-muted-foreground">
                    UTM Campaign
                  </label>
                  <input
                    placeholder="e.g. spring-2026"
                    className="w-full rounded-md border bg-background px-2.5 py-1.5 text-xs text-foreground outline-none placeholder:text-muted-foreground focus:ring-1 focus:ring-ring"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-[11px] font-medium text-muted-foreground">
                    UTM Source
                  </label>
                  <input
                    placeholder="e.g. sociuu"
                    className="w-full rounded-md border bg-background px-2.5 py-1.5 text-xs text-foreground outline-none placeholder:text-muted-foreground focus:ring-1 focus:ring-ring"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Action Bar */}
      <div className="flex items-center justify-between px-6 py-3">
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <Settings2 className="h-3.5 w-3.5" />
          Settings
          <ChevronUp
            className={`h-3 w-3 transition-transform ${expanded ? "" : "rotate-180"}`}
          />
        </button>

        <div className="flex items-center gap-2">
          <button className="rounded-lg px-4 py-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
            Save Draft
          </button>
          <button className="rounded-lg bg-primary px-5 py-2 text-xs font-semibold text-primary-foreground transition-all hover:opacity-90">
            Send Message
          </button>
        </div>
      </div>
    </div>
  );
};

export default SendingDrawer;
