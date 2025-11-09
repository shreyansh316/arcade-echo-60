import { useEffect } from "react";

export const ViewportGlitch = () => {
  useEffect(() => {
    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.target.classList.contains("glitch-on-viewport")) {
          // Add glitch effect
          entry.target.classList.add("glitch-trigger");
          
          // Remove after animation completes
          setTimeout(() => {
            entry.target.classList.remove("glitch-trigger");
          }, 400);
          
          // Unobserve after first trigger
          observer.unobserve(entry.target);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, {
      threshold: 0.2,
      rootMargin: "-50px",
    });

    // Observe all elements with glitch-on-viewport class
    const elements = document.querySelectorAll(".glitch-on-viewport");
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return null;
};
