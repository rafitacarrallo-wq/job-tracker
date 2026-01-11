"use client";

import { useState } from "react";
import { Sidebar } from "./sidebar";
import { MobileHeader } from "./mobile-header";
import { MobileNav } from "./mobile-nav";
import { BottomNav } from "./bottom-nav";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <>
      {/* Desktop Sidebar - hidden on mobile */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Mobile Header - visible only on mobile */}
      <MobileHeader onMenuClick={() => setMobileNavOpen(true)} />

      {/* Mobile Navigation Drawer */}
      <MobileNav open={mobileNavOpen} onOpenChange={setMobileNavOpen} />

      {/* Main Content */}
      <main className="pb-16 pt-14 md:pb-0 md:pl-64 md:pt-0">
        <div className="min-h-screen">{children}</div>
      </main>

      {/* Bottom Navigation - visible only on mobile */}
      <BottomNav />
    </>
  );
}
