import { getServerSession } from 'next-auth';

import { AppHeader } from '@/components/layout/header/app-header';
import { AppSidebar } from '@/components/layout/sidebar/app-sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export default async function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  const teams = session?.user?.id
    ? await prisma.team.findMany({
        where: { members: { some: { userId: session.user.id } } },
        orderBy: { createdAt: 'desc' }
      })
    : [];

  return (
    <SidebarProvider>
      <AppSidebar
        variant="floating"
        collapsible="icon"
        session={session}
        teams={teams}
      />
      <SidebarInset>
        <AppHeader />
        <div className="flex flex-1 flex-col p-6">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4">{children}</div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
