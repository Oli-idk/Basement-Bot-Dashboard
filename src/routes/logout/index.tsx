import type { RequestHandler } from '@builder.io/qwik-city';
import { prisma } from '~/root';
import getAuth from '~/components/functions/auth';

export const onGet: RequestHandler = async ({ redirect, cookie }) => {
  const auth = await getAuth(cookie);

  if (auth) {
    await prisma.sessions.delete({ where: { sessionId: auth.sessionId } });
    cookie.delete('sessionid', { path: '/' });
  }

  throw redirect(302, '/');
};