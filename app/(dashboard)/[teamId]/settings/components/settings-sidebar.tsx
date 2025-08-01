'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@/lib/utils';

interface SidebarNavItem {
  title: string;
  href: string;
}

const sidebarNavItems: SidebarNavItem[] = [
  {
    title: 'Team',
    href: 'team'
  },
  {
    title: 'Appearance',
    href: 'appearance'
  },
  {
    title: 'Notifications',
    href: 'notifications'
  },
  {
    title: 'Display',
    href: 'display'
  }
];

interface SettingsSidebarProps {
  teamId: string;
}

export function SettingsSidebar({ teamId }: Readonly<SettingsSidebarProps>) {
  const pathname = usePathname();

  return (
    <nav className="flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1">
      {sidebarNavItems.map((item) => (
        <Link
          key={item.href}
          href={`/${teamId}/settings/${item.href}`}
          className={cn(
            'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-9 px-4 py-2',
            pathname === `/${teamId}/settings/${item.href}`
              ? 'bg-muted hover:bg-muted'
              : 'hover:bg-transparent hover:underline',
            'justify-start'
          )}
        >
          {item.title}
        </Link>
      ))}
    </nav>
  );
}
