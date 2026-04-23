import React, { useState, useEffect } from 'react';
import { Analytics } from "@vercel/analytics/react";

export const ConsentManagedScripts: React.FC = () => {
  const [hasConsent, setHasConsent] = useState(false);

  useEffect(() => {
    const checkConsent = () => {
      const consent = localStorage.getItem('cookie-consent');
      setHasConsent(consent === 'all');
    };

    // Check on mount
    checkConsent();

    // Listen for updates
    window.addEventListener('cookie-consent-updated', checkConsent);
    return () => window.removeEventListener('cookie-consent-updated', checkConsent);
  }, []);

  if (!hasConsent) return null;

  return (
    <>
      <Analytics />
    </>
  );
};
