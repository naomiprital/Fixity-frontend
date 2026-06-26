import { useState } from 'react';
import './FixityWordmark.css';

export function FixityWordmark() {
  const [hasError, setHasError] = useState(false);

  return (
    <div className="fixity-wordmark" aria-label="Fixity">
      {hasError ? (
        <span className="fixity-wordmark__fallback">Fixity</span>
      ) : (
        <img
          className="fixity-wordmark__image"
          src="/assets/branding/fixity-logo.png"
          alt="Fixity"
          loading="eager"
          decoding="async"
          onError={() => setHasError(true)}
        />
      )}
    </div>
  );
}
