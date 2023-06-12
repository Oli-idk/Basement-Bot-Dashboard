import type { Cookie } from '@builder.io/qwik-city';
import { prisma } from '~/root';

export default async function getAuth(cookie: Cookie) {
  const sid = cookie.get('sessionid')?.value;
  if (!sid) return null;
  const session = await prisma.sessions.findUnique({
    where: {
      sessionId: sid,
    },
  });
  return session ?? null;
}