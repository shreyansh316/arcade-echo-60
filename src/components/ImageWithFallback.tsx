import { useState } from "react";
import { ImageOff } from "lucide-react";

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  className?: string;
  fallbackText?: string;
}

export const ImageWithFallback = ({ src, alt, className = "", fallbackText }: ImageWithFallbackProps) => {
  const [imgError, setImgError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleError = () => {
    setImgError(true);
    setIsLoading(false);
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  if (imgError) {
    return (
      <div className={`${className} bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center border border-border`}>
        <div className="text-center p-4">
          <ImageOff className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
          <p className="text-xs text-muted-foreground">{fallbackText || alt}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {isLoading && (
        <div className={`${className} bg-gradient-to-br from-primary/10 to-accent/10 animate-pulse flex items-center justify-center`}>
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      <img
        src={src}
        alt={alt}
        className={`${className} ${isLoading ? 'hidden' : ''}`}
        onError={handleError}
        onLoad={handleLoad}
        loading="lazy"
      />
    </>
  );
};

