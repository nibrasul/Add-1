import { notFound } from 'next/navigation';
import { cookies } from 'next/headers';
import prisma from '@/lib/db';
import { verifyJWT } from '@/lib/auth';
import ConnectClientPage from './ConnectClientPage';

export default async function ConnectRedirectPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;

  // Resolve username → profile
  const slug = username.toLowerCase().trim();
  const profile = await prisma.profile.findUnique({
    where: { username: slug },
    select: { id: true, name: true, avatar: true, tagline: true, userId: true },
  });

  if (!profile) {
    return notFound();
  }

  // Check authentication status
  const cookieStore = await cookies();
  const token = cookieStore.get('pertap_jwt')?.value;
  let loggedInUser = null;
  if (token) {
    loggedInUser = await verifyJWT(token);
  }

  return (
    <>
      <title>{`Connect with ${profile.name} — Tapfolio`}</title>
      <meta
        name="description"
        content={`Connect with ${profile.name} on Tapfolio${profile.tagline ? ': ' + profile.tagline : ''}`}
      />
      <ConnectClientPage
        username={username}
        profile={{
          id: profile.id,
          userId: profile.userId,
          name: profile.name,
          avatar: profile.avatar,
          tagline: profile.tagline ?? '',
        }}
        isLoggedIn={loggedInUser !== null}
      />
    </>
  );
}
