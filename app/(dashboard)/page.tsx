import { notFound, redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';

import Welcome from '@/components/welcome';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export default async function Page() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return <Welcome />;
  }

  const membership = await prisma.teamMember.findFirst({
    where: { userId: session.user.id },
    select: { teamId: true }
  });

  if (!membership?.teamId) {
    notFound();
  }
  redirect(`/${membership.teamId}`);
}
