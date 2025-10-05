import { LucideIcon } from 'lucide-react';

/**
 * Navigation item interface for sidebar menu
 */
export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: number; // For notification counts
}
