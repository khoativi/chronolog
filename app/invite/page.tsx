import { notFound, redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';

import InvitePageClient from '@/components/invite-page';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { isValidUuidV7 } from '@/lib/validate-utils';

type Props = {
  searchParams: Promise<{
    teamId?: string;
  }>;
};

export default async function InvitePage({ searchParams }: Readonly<Props>) {
  const teamId = (await searchParams)?.teamId;
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  if (!teamId || !isValidUuidV7(teamId)) {
    return notFound();
  }

  if (!userId) {
    return <InvitePageClient />;
  }

  const existTeam = await prisma.team.findFirst({
    where: { id: teamId }
  });

  if (!existTeam) {
    notFound();
  }

  const isMember = await prisma.teamMember.findFirst({
    where: { teamId, userId }
  });

  if (!isMember) {
    await prisma.teamMember.create({
      data: {
        teamId,
        userId,
        role: 'member'
      }
    });
  }

  redirect(`/${teamId}`);
}
