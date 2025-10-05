'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Sidebar from './Sidebar';
import Header from './Header';
import { Sheet, SheetContent } from '@/components/ui/sheet';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

/**
 * Main dashboard layout component with responsive sidebar and header
 *
 * - Desktop (>1024px): Full sidebar (240px) always visible
 * - Tablet (768-1024px): Condensed sidebar (64px) with icons only
 * - Mobile (<768px): Sidebar hidden, shows as overlay when menu clicked
 */
export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  // Close mobile sidebar on route change
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  return (
    <>
      {/* Skip to main content link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-trust focus:text-white focus:rounded-lg"
      >
        ข้ามไปยังเนื้อหาหลัก
      </a>

      <div className="flex h-screen overflow-hidden">
        {/* Desktop/Tablet Sidebar - Hidden on mobile */}
        <aside className="hidden md:flex md:w-16 lg:w-60 bg-trust">
          <Sidebar />
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header onMenuClick={() => setSidebarOpen(true)} />

          {/* Main Content */}
          <main id="main-content" className="flex-1 overflow-y-auto bg-simplicity p-4 sm:p-6">
            {children}
          </main>
        </div>

        {/* Mobile Sidebar Sheet */}
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetContent side="left" className="w-[280px] p-0 bg-trust">
            <Sidebar onNavigate={() => setSidebarOpen(false)} />
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
