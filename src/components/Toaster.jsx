import React from 'react';
import { Toaster as SonnerToaster } from 'sonner';

function Toaster() {
  return (
    <SonnerToaster
      position="top-right"
      toastOptions={{
        style: {
          background: 'var(--card)',
          color: 'var(--text-main)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
        },
        className: 'toast-item',
      }}
      theme="dark"
    />
  );
}

export default Toaster;
