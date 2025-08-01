import { NextResponse } from 'next/server';
import { z } from 'zod';

import { prisma } from '@/lib/prisma';
import { withAuth } from '@/lib/withAuth';

export const GET = withAuth(async (userId, request) => {
  const { searchParams } = new URL(request.url);
  const teamId = searchParams.get('teamId');

  const teamIdSchema = z.uuid();
  const parsedTeamId = teamIdSchema.safeParse(teamId);

  if (!parsedTeamId.success) {
    return NextResponse.json({ message: 'Invalid teamId' }, { status: 400 });
  }

  const teamIdValidated = parsedTeamId.data;

  const isMember = await prisma.teamMember.findFirst({
    where: {
      userId,
      teamId: teamIdValidated
    }
  });

  if (!isMember) {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }

  const projects = await prisma.project.findMany({
    where: {
      teamId: teamIdValidated
    },
    orderBy: {
      id: 'desc'
    }
  });

  return NextResponse.json(projects);
});
