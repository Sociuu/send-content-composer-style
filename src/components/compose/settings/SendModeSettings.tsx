import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export type SendMode = "now" | "schedule";

interface SendModeSettingsProps {
  mode: SendMode;
  onModeChange: (mode: SendMode) => void;
  scheduleDate: Date | undefined;
  onScheduleDateChange: (date: Date | undefined) => void;
  scheduleTime: string;
  onScheduleTimeChange: (time: string) => void;
  timezone: string;
  onTimezoneChange: (tz: string) => void;
}

const TIMEZONES = [
  { value: "Europe/Copenhagen", label: "Copenhagen (CET)" },
  { value: "Europe/London", label: "London (GMT)" },
  { value: "America/New_York", label: "New York (EST)" },
  { value: "America/Chicago", label: "Chicago (CST)" },
  { value: "America/Los_Angeles", label: "Los Angeles (PST)" },
  { value: "Asia/Tokyo", label: "Tokyo (JST)" },
  { value: "Australia/Sydney", label: "Sydney (AEDT)" },
];

const SendModeSettings = ({
  mode,
  onModeChange,
  scheduleDate,
  onScheduleDateChange,
  scheduleTime,
  onScheduleTimeChange,
  timezone,
  onTimezoneChange,
}: SendModeSettingsProps) => {
  return (
    <div className="space-y-3">
      <label className="block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        Send Mode
      </label>

      <div className="flex gap-1 rounded-lg bg-secondary p-0.5">
        <button
          onClick={() => onModeChange("now")}
          className={cn(
            "flex-1 rounded-md px-3 py-1.5 text-xs font-medium transition-all",
            mode === "now"
              ? "bg-card text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          Send Now
        </button>
        <button
          onClick={() => onModeChange("schedule")}
          className={cn(
            "flex-1 rounded-md px-3 py-1.5 text-xs font-medium transition-all",
            mode === "schedule"
              ? "bg-card text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          Schedule
        </button>
      </div>

      {mode === "schedule" && (
        <div className="space-y-2.5 rounded-lg border bg-secondary/50 p-3">
          <div className="grid grid-cols-2 gap-2.5">
            {/* Date Picker */}
            <div>
              <label className="mb-1 block text-[11px] font-medium text-muted-foreground">
                Date
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "h-8 w-full justify-start text-left text-xs font-normal",
                      !scheduleDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-1.5 h-3 w-3" />
                    {scheduleDate ? format(scheduleDate, "MMM d, yyyy") : "Pick date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={scheduleDate}
                    onSelect={onScheduleDateChange}
                    disabled={(date) => date < new Date()}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Time */}
            <div>
              <label className="mb-1 block text-[11px] font-medium text-muted-foreground">
                Time
              </label>
              <div className="relative">
                <Clock className="absolute left-2 top-1/2 h-3 w-3 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="time"
                  value={scheduleTime}
                  onChange={(e) => onScheduleTimeChange(e.target.value)}
                  className="h-8 w-full rounded-md border bg-background pl-7 pr-2 text-xs text-foreground outline-none focus:ring-1 focus:ring-ring"
                />
              </div>
            </div>
          </div>

          {/* Timezone */}
          <div>
            <label className="mb-1 block text-[11px] font-medium text-muted-foreground">
              Timezone
            </label>
            <select
              value={timezone}
              onChange={(e) => onTimezoneChange(e.target.value)}
              className="h-8 w-full rounded-md border bg-background px-2 text-xs text-foreground outline-none focus:ring-1 focus:ring-ring"
            >
              {TIMEZONES.map((tz) => (
                <option key={tz.value} value={tz.value}>
                  {tz.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );
};

export default SendModeSettings;
