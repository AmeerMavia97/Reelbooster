// hooks/useIntersection.tsx
import { useEffect, useRef } from "react";

export default function useIntersection(callback: (index: number) => void) {
  const refs = useRef<(HTMLVideoElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute("data-index"));
            callback(index);
          }
        });
      },
      { threshold: 0.85 }
    );

    refs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      refs.current.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, [callback]);

  return refs;
}