import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import prisma from '@/lib/db';
import { verifyJWT } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username')?.trim().toLowerCase();

    if (!username) {
      return NextResponse.json({ error: 'username is required.' }, { status: 400 });
    }

    // Resolve username -> profile
    const profile = await prisma.profile.findUnique({
      where: { username },
      include: { user: { select: { id: true, email: true } }, tags: true, socials: true },
    });

    if (!profile) {
      return NextResponse.json({ error: 'User not found.' }, { status: 404 });
    }

    // Check connection status if caller is authenticated
    let connectionStatus: string | null = null;
    let connectionId: number | null = null;

    const cookieStore = await cookies();
    const token = cookieStore.get('pertap_jwt')?.value;
    if (token) {
      const payload = await verifyJWT(token);
      if (payload && payload.userId !== profile.userId) {
        const conn = await prisma.connection.findFirst({
          where: {
            OR: [
              { requesterId: payload.userId, receiverId: profile.userId },
              { requesterId: profile.userId, receiverId: payload.userId },
            ],
          },
        });
        if (conn) {
          connectionStatus = conn.status;
          connectionId = conn.id;
        }
      }
    }

    return NextResponse.json({
      success: true,
      profile: {
        id: profile.id,
        userId: profile.userId,
        name: profile.name,
        tagline: profile.tagline,
        avatar: profile.avatar,
        bio: profile.bio,
        isOnline: profile.isOnline,
        tags: profile.tags,
        socials: profile.socials,
      },
      connectionStatus,
      connectionId,
    });
  } catch (error: any) {
    console.error('Connection lookup error:', error);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}
