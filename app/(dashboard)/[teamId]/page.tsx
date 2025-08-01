import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getServerSession } from 'next-auth';

import DashboardEvent from '@/components/dashboard/DashboardEvent';
import DashboardSectionCard from '@/components/dashboard/DashboardSectionCard';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { isValidUuidV7 } from '@/lib/validate-utils';

type Props = {
  params: Promise<{ projectId: string; teamId: string }>;
};

async function getDashboardStats(teamId: string | undefined) {
  const [totalProjects, totalEvents] = await Promise.all([
    prisma.project.count({
      where: {
        teamId
      }
    }),
    prisma.event.count({
      where: {
        project: {
          teamId
        }
      }
    })
  ]);

  const totalMembers = await prisma.teamMember.count({
    where: { teamId }
  });

  const events = await prisma.event.findMany({
    where: {
      project: {
        teamId
      }
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          emailVerified: true,
          image: true,
          createdAt: true,
          updatedAt: true
        }
      }
    },
    orderBy: {
      id: 'desc'
    },
    take: 50
  });

  return {
    totalProjects,
    totalEvents,
    totalMembers,
    events
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const teamId = (await params).teamId;

  if (!isValidUuidV7(teamId)) {
    notFound();
  }

  const team = await prisma.team.findFirst({
    where: { id: teamId },
    select: { name: true }
  });

  if (!team) {
    notFound();
  }

  return {
    title: `Dashboard Team ${team.name}`,
    description: `Truy cập dashboard tổng quan của team ${team.name} trên ChronoLog. Xem các dự án của team, theo dõi tiến độ và quản lý hoạt động cộng tác hiệu quả.`,
    openGraph: {
      title: `Dashboard Team ${team.name}`,
      description: `Truy cập dashboard tổng quan của team ${team.name} trên ChronoLog. Xem các dự án của team, theo dõi tiến độ và quản lý hoạt động cộng tác hiệu quả.`
    }
  };
}

export default async function Page({ params }: Readonly<Props>) {
  const { teamId } = await params;

  if (!isValidUuidV7(teamId)) {
    notFound();
  }

  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  const isMember = await prisma.teamMember.findFirst({
    where: { userId, teamId }
  });

  if (!isMember) {
    notFound();
  }

  const { totalMembers, totalEvents, totalProjects, events } =
    await getDashboardStats(teamId);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
      <DashboardSectionCard
        totalProjects={totalProjects}
        totalEvents={totalEvents}
        totalMembers={totalMembers}
      />
      <DashboardEvent teamId={teamId} events={events} />
    </div>
  );
}
