import { useEffect } from "react";

export const ScrollGlitchEffect = () => {
  useEffect(() => {
    // Use IntersectionObserver to trigger effects when major elements enter viewport
    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const target = entry.target as HTMLElement;
          
          // Check if it's a major element (sections, headings, cards, etc.)
          if (
            target.tagName === "SECTION" ||
            target.tagName === "H1" ||
            target.tagName === "H2" ||
            target.tagName === "H3" ||
            target.classList.contains("glitch-on-viewport") ||
            target.classList.contains("major-element")
          ) {
            // Apply chromatic aberration and light shake
            target.classList.add("glitch-trigger");
            
            // Remove after animation completes
            setTimeout(() => {
              target.classList.remove("glitch-trigger");
            }, 600);
            
            // Unobserve after first trigger
            observer.unobserve(target);
          }
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, {
      threshold: 0.2,
      rootMargin: "0px",
    });

    // Observe all major elements
    const majorElements = document.querySelectorAll(
      "section, h1, h2, h3, .glitch-on-viewport, .major-element"
    );
    majorElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return null;
};
