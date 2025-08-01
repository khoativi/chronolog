'use client';
import { Team } from '@prisma/client';
import {
  LayoutDashboard,
  LifeBuoy,
  Loader,
  Plus,
  Send,
  Settings
} from 'lucide-react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Session } from 'next-auth';
import { signOut } from 'next-auth/react';
import * as React from 'react';
import { useState } from 'react';

import SignInModal from '@/components/sign-in-modal';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail
} from '@/components/ui/sidebar';

const AppSidebarNavUser = dynamic(() => import('./app-sidebar-nav-user'), {
  ssr: false
});
const AppSidebarProject = dynamic(() => import('./app-sidebar-project'), {
  ssr: false,
  loading: () => (
    <div className="flex justify-center items-center py-4">
      <Loader className="animate-spin" />
    </div>
  )
});
const AppSidebarTeamSwitcher = dynamic(
  () => import('./app-sidebar-team-switcher'),
  {
    ssr: false
  }
);
const ProjectCreateDialog = dynamic(
  () => import('./modal/project-create-dialog'),
  {
    ssr: false
  }
);

const navSecondary = [
  {
    title: 'Support',
    url: '#',
    icon: LifeBuoy
  },
  {
    title: 'Feedback',
    url: '#',
    icon: Send
  }
];

export function AppSidebar({
  session,
  teams,
  ...props
}: { session: Session | null; teams: Team[] } & React.ComponentProps<
  typeof Sidebar
>) {
  const [showCreate, setShowCreate] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const pathname = usePathname();
  const teamId = pathname.split('/')[1];

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        {session?.user ? <AppSidebarTeamSwitcher teams={teams} /> : null}
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent className="flex flex-col gap-2">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href={`/${teamId}`}>
                    <LayoutDashboard />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href={`/${teamId}/settings/team`}>
                    <Settings />
                    <span>Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
          <SidebarGroupLabel>Dự án</SidebarGroupLabel>
          <SidebarGroupAction
            onClick={() => {
              if (session?.user) {
                setShowCreate(true);
              }
            }}
          >
            <Plus /> <span className="sr-only">Thêm dự án</span>
          </SidebarGroupAction>
          {session?.user ? (
            <AppSidebarProject />
          ) : (
            <div className="text-sm text-muted-foreground p-4 text-center">
              <p className="mb-2">Đăng nhập để nhìn thấy dự án của bạn</p>
              <button
                onClick={() => setShowLogin(true)}
                className="text-sm font-medium text-primary hover:underline"
              >
                Sign In
              </button>
            </div>
          )}
        </SidebarGroup>
        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <SidebarMenu>
              {navSecondary.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild size="sm">
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {session?.user && (
        <SidebarFooter>
          <AppSidebarNavUser
            onClickConfirm={() => setShowConfirm(true)}
            user={{
              name: session.user.name!,
              email: session.user.email!,
              avatar: session.user.image ?? ''
            }}
          />
        </SidebarFooter>
      )}
      <SidebarRail />
      <ProjectCreateDialog
        teamId={teamId}
        open={showCreate}
        onOpenChange={setShowCreate}
      />
      <SignInModal open={showLogin} onClose={() => setShowLogin(false)} />

      <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Bạn có chắc chắn muốn đăng xuất?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Hành động này sẽ đăng xuất bạn khỏi hệ thống. Bạn có thể đăng nhập
              lại bất cứ lúc nào.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={() => signOut()}>
              Đăng xuất
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Sidebar>
  );
}
