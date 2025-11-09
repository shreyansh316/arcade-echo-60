import { useEffect, useState } from "react";

export const MagneticCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const updateCursor = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === "BUTTON" ||
        target.tagName === "A" ||
        target.closest("button") ||
        target.closest("a")
      ) {
        setIsHovering(true);
      }
    };

    const handleMouseOut = () => {
      setIsHovering(false);
    };

    window.addEventListener("mousemove", updateCursor);
    document.addEventListener("mouseover", handleMouseOver);
    document.addEventListener("mouseout", handleMouseOut);

    return () => {
      window.removeEventListener("mousemove", updateCursor);
      document.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseout", handleMouseOut);
    };
  }, []);

  return (
    <>
      {/* Main cursor dot */}
      <div
        className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference"
        style={{
          transform: `translate(${position.x}px, ${position.y}px)`,
          transition: "transform 0.05s ease-out",
        }}
      >
        <div
          className={`w-2 h-2 bg-primary rounded-full -translate-x-1/2 -translate-y-1/2 transition-all duration-200 ${
            isHovering ? "scale-0" : "scale-100"
          }`}
        />
      </div>

      {/* Outer ring */}
      <div
        className="fixed top-0 left-0 pointer-events-none z-[9998]"
        style={{
          transform: `translate(${position.x}px, ${position.y}px)`,
          transition: "transform 0.15s ease-out",
        }}
      >
        <div
          className={`rounded-full border-2 border-primary -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${
            isHovering ? "w-12 h-12 opacity-100" : "w-8 h-8 opacity-50"
          }`}
          style={{
            boxShadow: isHovering ? "0 0 20px hsl(var(--primary) / 0.5)" : "none",
          }}
        />
      </div>
    </>
  );
};
