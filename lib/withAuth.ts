import 'server-only';

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import { authOptions } from './auth';

type AuthHandler = (userId: string, request: Request) => Promise<Response>;

export function withAuth(handler: AuthHandler) {
  return async (request: Request): Promise<Response> => {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    try {
      return await handler(session.user.id, request);
    } catch {
      return NextResponse.json(
        { message: 'Internal Server Error' },
        { status: 500 }
      );
    }
  };
}
