'use server';

import * as Sentry from '@sentry/nextjs';
import { getServerSession } from 'next-auth';
import { uuidv7 } from 'uuidv7';

import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { createTeamSchema } from '@/schemas/team';

export async function createTeam(formData: FormData) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return {
        success: false,
        message: 'Bạn chưa đăng nhập'
      };
    }
    const userId = session.user.id;

    const parseResult = createTeamSchema.safeParse(
      Object.fromEntries(formData)
    );
    if (!parseResult.success) {
      return {
        success: false,
        message: parseResult.error.issues[0]?.message ?? 'Dữ liệu không hợp lệ'
      };
    }
    const { name } = parseResult.data;

    const team = await prisma.team.create({
      data: {
        id: uuidv7(),
        name,
        members: {
          create: {
            userId,
            role: 'owner'
          }
        }
      }
    });

    return {
      success: true,
      team
    };
  } catch (error) {
    Sentry.captureException(error, { tags: { action: 'create-team' } });
    return {
      success: false,
      message: 'Lỗi khi tạo team. Vui lòng thử lại sau.'
    };
  }
}
