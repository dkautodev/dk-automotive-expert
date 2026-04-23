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
  overlayOpacity = "bg-black/40",
  className,
  children,
  height = "min-h-[400px] md:min-h-[500px]"
}) => {
  return (
    <section 
      className={cn(
        "relative flex items-center bg-cover bg-center overflow-hidden -mt-[98px]",
        height,
        className
      )}
      style={backgroundImage ? { backgroundImage: `url("${backgroundImage}")` } : {}}
    >
      {/* Overlay */}
      <div className={cn("absolute inset-0 z-0", overlayOpacity)} />
      
      {/* Decorative Elements */}
      <div className="absolute -bottom-px left-0 w-full h-8 bg-gradient-to-t from-white to-transparent z-10" />

      <div className="container mx-auto px-4 relative z-20 pt-[140px] pb-16 md:pt-[180px] md:pb-24">
        <div className="max-w-2xl animate-slideIn">
          {subtitle && (
            <span className="inline-block text-white/80 text-xs md:text-sm font-semibold tracking-[0.2em] uppercase mb-6 border-l-2 border-white/30 pl-4">
              {subtitle}
            </span>
          )}
          <h1 className="text-white mb-6 leading-tight drop-shadow-sm font-bold">
            {title}
          </h1>
          {description && (
            <p className="text-base md:text-lg text-white/80 font-normal leading-relaxed mb-8 max-w-xl">
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
