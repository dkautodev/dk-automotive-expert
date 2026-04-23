import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Cookie, X, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

export const CookieConsent: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    // Vérifier si le consentement a déjà été donné
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      // Afficher le bandeau après un court délai
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem('cookie-consent', 'all');
    setIsVisible(false);
    window.dispatchEvent(new Event('cookie-consent-updated'));
  };

  const handleAcceptEssential = () => {
    localStorage.setItem('cookie-consent', 'essential');
    setIsVisible(false);
    window.dispatchEvent(new Event('cookie-consent-updated'));
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-[100] flex justify-center pointer-events-none">
      <Card className={cn(
        "w-full max-w-2xl pointer-events-auto shadow-2xl border-primary/20 bg-background/95 backdrop-blur-md transition-all duration-500 animate-in fade-in slide-in-from-bottom-8",
        isExpanded ? "p-6" : "p-4"
      )}>
        <div className="flex flex-col gap-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Cookie className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Respect de votre vie privée</h3>
                {!isExpanded && (
                  <p className="text-sm text-muted-foreground line-clamp-1">
                    Nous utilisons des cookies pour améliorer votre expérience et analyser notre trafic.
                  </p>
                )}
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 shrink-0"
              onClick={() => setIsVisible(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {isExpanded && (
            <div className="space-y-3 animate-in fade-in duration-300">
              <p className="text-sm text-muted-foreground leading-relaxed">
                DK Automotive utilise des cookies techniques nécessaires au bon fonctionnement du site. 
                Nous utilisons également Vercel Analytics pour mesurer l'audience et améliorer nos services.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/50 border border-border">
                  <ShieldCheck className="h-4 w-4 text-emerald-600 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold">Essentiels</p>
                    <p className="text-[11px] text-muted-foreground">Sécurité et fonctionnalités de base indispensables.</p>
                  </div>
                </div>
                <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/50 border border-border opacity-80">
                  <Cookie className="h-4 w-4 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold">Analytiques</p>
                    <p className="text-[11px] text-muted-foreground">Mesure d'audience et suivi des performances via Vercel.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
            {!isExpanded && (
              <Button 
                variant="link" 
                size="sm" 
                className="text-xs h-auto p-0"
                onClick={() => setIsExpanded(true)}
              >
                Personnaliser
              </Button>
            )}
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1 sm:flex-none text-xs"
                onClick={handleAcceptEssential}
              >
                Uniquement essentiels
              </Button>
              <Button 
                variant="default" 
                size="sm" 
                className="flex-1 sm:flex-none text-xs bg-primary hover:bg-primary/90"
                onClick={handleAcceptAll}
              >
                Tout accepter
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
