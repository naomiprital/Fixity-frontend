import type { PropsWithChildren } from 'react';
import './PhoneShell.css';

export function PhoneShell({ children }: PropsWithChildren) {
  return (
    <div className="phone-shell">
      <div className="phone-shell__screen">{children}</div>
    </div>
  );
}
