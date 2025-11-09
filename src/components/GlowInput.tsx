import React, { useRef, useState } from "react";
import { Input, InputProps } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface GlowInputProps extends InputProps {
  icon?: React.ReactNode;
  containerClassName?: string;
}

export const GlowInput = React.forwardRef<HTMLInputElement, GlowInputProps>(
  ({ className, icon, containerClassName, ...props }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setMousePosition({ x, y });
    };

    return (
      <div 
        ref={containerRef}
        className={cn("input-group", containerClassName)}
        onMouseMove={handleMouseMove}
        style={{
          '--mouse-x': `${mousePosition.x}px`,
          '--mouse-y': `${mousePosition.y}px`,
        } as React.CSSProperties}
      >
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground z-10 pointer-events-none">
              {icon}
            </div>
          )}
          <Input
            ref={ref}
            className={cn(icon ? "pl-10" : "", "relative z-10", className)}
            {...props}
          />
        </div>
      </div>
    );
  }
);
GlowInput.displayName = "GlowInput";
