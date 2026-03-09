import { cn } from "@/lib/utils";

const DAYS = [
  { key: "mon", label: "M" },
  { key: "tue", label: "T" },
  { key: "wed", label: "W" },
  { key: "thu", label: "T" },
  { key: "fri", label: "F" },
  { key: "sat", label: "S" },
  { key: "sun", label: "S" },
];

const TIMEZONES = [
  { value: "Europe/Copenhagen", label: "Copenhagen (CET)" },
  { value: "Europe/London", label: "London (GMT)" },
  { value: "America/New_York", label: "New York (EST)" },
  { value: "America/Los_Angeles", label: "Los Angeles (PST)" },
];

interface DeliveryWindowSettingsProps {
  enabled: boolean;
  onEnabledChange: (val: boolean) => void;
  allowedDays: string[];
  onAllowedDaysChange: (days: string[]) => void;
  startTime: string;
  onStartTimeChange: (t: string) => void;
  endTime: string;
  onEndTimeChange: (t: string) => void;
  timezone: string;
  onTimezoneChange: (tz: string) => void;
}

const DeliveryWindowSettings = ({
  enabled,
  onEnabledChange,
  allowedDays,
  onAllowedDaysChange,
  startTime,
  onStartTimeChange,
  endTime,
  onEndTimeChange,
  timezone,
  onTimezoneChange,
}: DeliveryWindowSettingsProps) => {
  const toggleDay = (day: string) => {
    onAllowedDaysChange(
      allowedDays.includes(day)
        ? allowedDays.filter((d) => d !== day)
        : [...allowedDays, day]
    );
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={enabled}
          onChange={(e) => onEnabledChange(e.target.checked)}
          className="h-3.5 w-3.5 accent-primary"
        />
        <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Delivery Window
        </label>
      </div>

      {enabled && (
        <div className="space-y-3 rounded-lg border bg-secondary/50 p-3">
          {/* Day selector */}
          <div>
            <label className="mb-1.5 block text-[11px] font-medium text-muted-foreground">
              Allowed days
            </label>
            <div className="flex gap-1">
              {DAYS.map((day) => (
                <button
                  key={day.key}
                  onClick={() => toggleDay(day.key)}
                  className={cn(
                    "flex h-7 w-7 items-center justify-center rounded-md text-[11px] font-medium transition-all",
                    allowedDays.includes(day.key)
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:text-foreground"
                  )}
                >
                  {day.label}
                </button>
              ))}
            </div>
          </div>

          {/* Time range */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="mb-1 block text-[11px] font-medium text-muted-foreground">
                From
              </label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => onStartTimeChange(e.target.value)}
                className="h-8 w-full rounded-md border bg-background px-2 text-xs text-foreground outline-none focus:ring-1 focus:ring-ring"
              />
            </div>
            <div>
              <label className="mb-1 block text-[11px] font-medium text-muted-foreground">
                To
              </label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => onEndTimeChange(e.target.value)}
                className="h-8 w-full rounded-md border bg-background px-2 text-xs text-foreground outline-none focus:ring-1 focus:ring-ring"
              />
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
                <option key={tz.value} value={tz.value}>{tz.label}</option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeliveryWindowSettings;
