import { useEffect, useState } from "react";

interface Sparkle {
  id: number;
  x: number;
  y: number;
  delay: number;
  angle: number;
  distance: number;
}

interface SparkleEffectProps {
  trigger: boolean;
  onComplete?: () => void;
  cursorX?: number;
  cursorY?: number;
}

export const SparkleEffect = ({ trigger, onComplete, cursorX, cursorY }: SparkleEffectProps) => {
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);

  useEffect(() => {
    if (trigger) {
      const centerX = cursorX !== undefined ? cursorX : window.innerWidth / 2;
      const centerY = cursorY !== undefined ? cursorY : window.innerHeight / 2;
      
      // Reduced number of sparkles for less bulk
      const newSparkles: Sparkle[] = Array.from({ length: 15 }, (_, i) => {
        const angle = (Math.PI * 2 * i) / 15;
        const distance = 30 + Math.random() * 50; // Reduced distance
        return {
          id: i,
          x: centerX,
          y: centerY,
          delay: Math.random() * 0.2,
          angle,
          distance,
        };
      });
      setSparkles(newSparkles);

      const timer = setTimeout(() => {
        setSparkles([]);
        onComplete?.();
      }, 800); // Shorter duration

      return () => clearTimeout(timer);
    }
  }, [trigger, onComplete, cursorX, cursorY]);

  return (
    <>
      <div className="fixed inset-0 pointer-events-none z-[10000]">
        {sparkles.map((sparkle) => {
          const endX = Math.cos(sparkle.angle) * sparkle.distance;
          const endY = Math.sin(sparkle.angle) * sparkle.distance;
          
          return (
            <div
              key={sparkle.id}
              className="absolute w-2 h-2 rounded-full bg-primary"
              style={{
                left: `${sparkle.x}px`,
                top: `${sparkle.y}px`,
                transform: 'translate(-50%, -50%)',
                animation: `sparkleBurst-${sparkle.id} 0.8s ease-out ${sparkle.delay}s forwards`,
                boxShadow: "0 0 8px hsl(var(--primary)), 0 0 16px hsl(var(--primary))",
              }}
            />
          );
        })}
      </div>
      <style>{`
        ${sparkles.map((sparkle) => {
          const endX = Math.cos(sparkle.angle) * sparkle.distance;
          const endY = Math.sin(sparkle.angle) * sparkle.distance;
          return `
            @keyframes sparkleBurst-${sparkle.id} {
              0% {
                opacity: 1;
                transform: translate(-50%, -50%) scale(1);
              }
              100% {
                opacity: 0;
                transform: translate(calc(-50% + ${endX}px), calc(-50% + ${endY}px)) scale(0.3);
              }
            }
          `;
        }).join('')}
      `}</style>
    </>
  );
};
