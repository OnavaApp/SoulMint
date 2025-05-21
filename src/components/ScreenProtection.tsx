"use client";

import { useEffect, useState } from 'react';

export default function ScreenProtection() {
  const [showOverlay, setShowOverlay] = useState(false);

  useEffect(() => {
    const threshold = 160;

    function shouldShowOverlay() {
      const isMobile = window.innerWidth < 768;
      const devToolsOpen = (window.outerWidth - window.innerWidth > threshold) ||
                           (window.outerHeight - window.innerHeight > threshold);
      return isMobile || devToolsOpen;
    }

    function handleResize() {
      setShowOverlay(shouldShowOverlay());
    }

    // Initial check
    handleResize();

    window.addEventListener('resize', handleResize);

    // Optional: Devtools detection via debugger timing (still flaky)
    const intervalId = setInterval(() => {
      const start = performance.now();
      debugger;
      const end = performance.now();
      if (end - start > 100) {
        setShowOverlay(true);
      }
    }, 1000);

    return () => {
      window.removeEventListener('resize', handleResize);
      clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = showOverlay ? 'hidden' : 'auto';
  }, [showOverlay]);

  if (!showOverlay) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'black',
        color: 'white',
        fontSize: '2rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
        textAlign: 'center',
        padding: '20px',
      }}
    >
      <img
        src="/SOUL.png"
        alt="Soul Logo"
        style={{ width: '120px', marginBottom: '20px' }}
      />
      <p>This website isn't available on mobile devices.</p>
    </div>
  );
}