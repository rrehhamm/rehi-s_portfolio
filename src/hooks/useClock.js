import { useState, useEffect } from "react";

export function useClock() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000 * 15);
    return () => clearInterval(id);
  }, []);

  const time = now.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
  const day = now.toLocaleDateString(undefined, { weekday: "short" });
  const date = now.toLocaleDateString(undefined, { month: "short", day: "numeric" });

  return { now, time, day, date };
}
