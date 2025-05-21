'use client'; // <-- makes this a client component

import { useEffect, useState } from "react";

export default function ResponsiveWrapper({ children }: { children: React.ReactNode }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (isMobile) {
    return (
      <div className="fixed inset-0 bg-white z-[9999] flex items-center justify-center text-center p-6">
        <h1 className="text-xl font-bold">
          This website is not supported on mobile devices.
        </h1>
      </div>
    );
  }

  return <>{children}</>;
}