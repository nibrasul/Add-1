import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params;
    if (!username) {
      return NextResponse.json({ error: 'Username is required.' }, { status: 400 });
    }

    const slug = username.toLowerCase().trim();
    const profile = await prisma.profile.findUnique({
      where: { username: slug },
      include: {
        tags: true,
        socials: true,
        user: {
          select: {
            connectionCount: true,
          },
        },
      },
    });

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found.' }, { status: 404 });
    }

    return NextResponse.json(
      {
        success: true,
        profile: {
          id: profile.id,
          userId: profile.userId,
          name: profile.name,
          username: profile.username,
          tagline: profile.tagline,
          avatar: profile.avatar,
          bio: profile.bio,
          isOnline: profile.isOnline,
          diamonds: profile.diamonds,
          isPremium: profile.isPremium,
          tapCount: profile.tapCount,
          connectionCount: profile.user?.connectionCount ?? 0,
          tags: profile.tags,
          socials: profile.socials,
        },
      },
      {
        headers: {
          'Cache-Control': 'public, max-age=15',
        },
      }
    );
  } catch (error: any) {
    console.error('API Profile Lookup Error:', error);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}
