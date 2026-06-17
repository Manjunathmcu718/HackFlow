import React, { useState, useEffect } from "react";

type CountdownTimerProps = {
  targetDate?: string;
  label?: string;
  compact?: boolean;
};

export default function CountdownTimer({ targetDate, label, compact = false }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    const calc = () => {
      if (!targetDate) {
        setExpired(true);
        return;
      }

      const diff = new Date(targetDate).getTime() - Date.now();
      if (diff <= 0) { setExpired(true); return; }
      setTimeLeft({
        days:    Math.floor(diff / 86400000),
        hours:   Math.floor((diff / 3600000) % 24),
        minutes: Math.floor((diff / 60000) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    };
    calc();
    const id = setInterval(calc, 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  if (expired) return (
    <div className="text-center">
      {label && <p className="text-xs text-muted-foreground mb-1">{label}</p>}
      <p className="text-sm font-semibold text-destructive">Deadline Passed</p>
    </div>
  );

  const units = [
    { label: "Days", value: timeLeft.days },
    { label: "Hrs",  value: timeLeft.hours },
    { label: "Min",  value: timeLeft.minutes },
    { label: "Sec",  value: timeLeft.seconds },
  ];

  if (compact) return (
    <div className="text-center">
      {label && <p className="text-xs text-muted-foreground mb-1">{label}</p>}
      <p className="text-sm font-mono font-semibold tabular-nums">
        {String(timeLeft.days).padStart(2,"0")}d {String(timeLeft.hours).padStart(2,"0")}h{" "}
        {String(timeLeft.minutes).padStart(2,"0")}m {String(timeLeft.seconds).padStart(2,"0")}s
      </p>
    </div>
  );

  return (
    <div>
      {label && <p className="text-xs text-muted-foreground text-center mb-3">{label}</p>}
      <div className="flex items-center gap-2 sm:gap-3">
        {units.map(u => (
          <div key={u.label} className="flex flex-col items-center">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-card border border-border flex items-center justify-center">
              <span className="text-xl sm:text-2xl font-mono font-bold tabular-nums">{String(u.value).padStart(2,"0")}</span>
            </div>
            <span className="text-[10px] text-muted-foreground mt-1 uppercase tracking-wider">{u.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

