import type { RequestHandler } from '@builder.io/qwik-city';
import { PrismaClient } from '@prisma/client';
import getAuth from '~/components/functions/auth';

export const onGet: RequestHandler = async ({ redirect, cookie }) => {
  const auth = await getAuth(cookie);

  if (auth) {
    const prisma = new PrismaClient();
    await prisma.sessions.delete({ where: { sessionId: auth.sessionId } });
    cookie.delete('sessionid', { path: '/' });
  }

  throw redirect(302, '/');
};