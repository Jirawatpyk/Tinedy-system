'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Calendar,
  Users,
  UserCog,
  CalendarDays,
  Settings
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { NavItem } from '@/types/navigation';

const menuItems: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'การจอง', href: '/bookings', icon: Calendar },
  { label: 'ลูกค้า', href: '/customers', icon: Users },
  { label: 'พนักงาน', href: '/staff', icon: UserCog },
  { label: 'ปฏิทิน', href: '/calendar', icon: CalendarDays },
  { label: 'ตั้งค่า', href: '/settings', icon: Settings },
];

interface SidebarProps {
  onNavigate?: () => void;
}

export default function Sidebar({ onNavigate }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="flex flex-col h-full bg-trust text-white">
      {/* Logo Area */}
      <div className="flex items-center justify-center h-20 px-6 border-b border-slate-700">
        <Link
          href="/dashboard"
          aria-label="กลับไปหน้าแรก"
          className="text-2xl font-display font-bold text-white hover:scale-105 transition-transform duration-200"
        >
          Tinedy
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4" aria-label="หลัก">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              aria-current={isActive ? 'page' : undefined}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                'hover:bg-slate-700/50',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-slate-800',
                isActive
                  ? 'bg-slate-700 text-white border-l-4 border-eco'
                  : 'text-slate-300'
              )}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              <span className="lg:inline hidden">{item.label}</span>
              {item.badge && (
                <span className="ml-auto bg-eco text-trust text-xs font-semibold px-2 py-0.5 rounded-full lg:inline hidden">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Section Placeholder */}
      <div className="p-4 border-t border-slate-700">
        <div className="text-xs text-slate-400 text-center lg:text-left">
          v0.1.0
        </div>
      </div>
    </aside>
  );
}
