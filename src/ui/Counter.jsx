import { useEffect, useRef, useState } from "react";

export default function Counter({ to, duration = 1200, prefix = "", suffix = "", className = "" }) {
  const [val, setVal] = useState(0);
  const rafRef = useRef(null);
  const startRef = useRef(null);

  useEffect(() => {
    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
    const animate = (ts) => {
      if (!startRef.current) startRef.current = ts;
      const p = Math.min(1, (ts - startRef.current) / duration);
      setVal(Math.round(to * easeOutCubic(p)));
      if (p < 1) rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [to, duration]);

  return <span className={className}>{prefix}{val}{suffix}</span>;
}
