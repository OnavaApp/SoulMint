import { useEffect, useState } from 'react';

export default function DevToolsBlocker() {
  const [devToolsOpen, setDevToolsOpen] = useState(false);

  useEffect(() => {
    const detectDevTools = () => {
      const threshold = 160;
      const widthDiff = window.outerWidth - window.innerWidth > threshold;
      const heightDiff = window.outerHeight - window.innerHeight > threshold;

      if (widthDiff || heightDiff) {
        setDevToolsOpen(true);
      } else {
        setDevToolsOpen(false);
      }
    };

    const interval = setInterval(detectDevTools, 500);
    return () => clearInterval(interval);
  }, []);

  if (devToolsOpen) {
    return (
      <div
        style={{
          width: '100vw',
          height: '100vh',
          backgroundColor: 'white',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          color: 'black',
          fontSize: '2rem',
          fontWeight: 'bold',
          textAlign: 'center',
          padding: '1rem',
          userSelect: 'none',
        }}
      >
        This website isn't available on mobile
      </div>
    );
  }

  return null; // Render nothing if devtools not open
}