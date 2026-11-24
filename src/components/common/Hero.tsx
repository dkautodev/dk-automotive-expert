import React from 'react';
import { cn } from '@/lib/utils';

interface HeroProps {
  title: string;
  subtitle?: string;
  description?: string;
  backgroundImage?: string;
  overlayOpacity?: string;
  className?: string;
  children?: React.ReactNode;
  height?: string;
}

export const Hero: React.FC<HeroProps> = ({
  title,
  subtitle,
  description,
  backgroundImage,
  overlayOpacity = "bg-black/50",
  className,
  children,
  height = "min-h-[480px] md:min-h-[600px]"
}) => {
  return (
    <section 
      className={cn(
        "relative flex items-center overflow-hidden -mt-[98px]",
        height,
        className
      )}
    >
      {/* Background Image optimisée pour le LCP et Google Images */}
      {backgroundImage && (
        <img
          src={backgroundImage}
          alt={title}
          fetchPriority="high"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover z-0"
        />
      )}

      {/* Overlay */}
      <div className={cn("absolute inset-0 z-10", overlayOpacity)} />
      
      {/* Decorative Elements */}
      <div className="absolute -bottom-px left-0 w-full h-8 bg-gradient-to-t from-white to-transparent z-10" />

      <div className="container mx-auto px-4 relative z-20 pt-[140px] pb-16 md:pt-[170px] md:pb-20">
        <div className="max-w-3xl animate-slideIn">
          {subtitle && (
            <span className="inline-block text-white/90 text-xs md:text-sm font-semibold tracking-[0.2em] uppercase mb-4 border-l-2 border-white/50 pl-3">
              {subtitle}
            </span>
          )}
          <h1 className="text-white mb-6 leading-tight drop-shadow-sm font-bold text-3xl md:text-5xl">
            {title}
          </h1>
          {description && (
            <p className="text-base md:text-xl text-white/85 font-normal leading-relaxed mb-8 max-w-2xl">
              {description}
            </p>
          )}
          {children}
        </div>
      </div>
    </section>
  );
};

export default Hero;
