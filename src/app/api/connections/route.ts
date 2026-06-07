import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import prisma from '@/lib/db';
import { verifyJWT } from '@/lib/auth';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('pertap_jwt')?.value;
    if (!token) return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 });

    const payload = await verifyJWT(token);
    if (!payload) return NextResponse.json({ error: 'Invalid token.' }, { status: 401 });

    const accepted = await prisma.connection.findMany({
      where: {
        status: 'accepted',
        OR: [
          { requesterId: payload.userId },
          { receiverId: payload.userId },
        ],
      },
      orderBy: { updatedAt: 'desc' },
      include: {
        requester: {
          include: {
            profile: {
              include: { tags: true, socials: true },
            },
            sharingSettings: true,
          },
        },
        receiver: {
          include: {
            profile: {
              include: { tags: true, socials: true },
            },
            sharingSettings: true,
          },
        },
      },
    });

    const connections = accepted.map(conn => {
      // The "other" user is the one who is not the caller
      const isRequester = conn.requesterId === payload.userId;
      const otherUser = isRequester ? conn.receiver : conn.requester;
      const otherProfile = otherUser.profile;
      const otherSettings = otherUser.sharingSettings;

      return {
        id: conn.id,
        via: conn.via,
        connectedAt: conn.updatedAt,
        other: {
          userId: otherUser.id,
          email: otherSettings?.shareEmail ? otherUser.email : null,
          name: otherSettings?.shareName ? (otherProfile?.name ?? otherUser.name) : null,
          avatar: otherProfile?.avatar ?? '/profile_avatar.png',
          tagline: otherProfile?.tagline ?? '',
          phone: otherSettings?.sharePhone ? (otherProfile?.phone ?? null) : null,
          whatsapp: otherSettings?.shareWhatsapp ? (otherProfile?.whatsapp ?? null) : null,
          location: otherSettings?.shareLocation ? (otherProfile?.location ?? null) : null,
          tags: otherProfile?.tags ?? [],
          profileId: otherProfile?.id ?? null,
        },
        permissions: otherSettings
          ? {
              shareName: otherSettings.shareName,
              shareEmail: otherSettings.shareEmail,
              sharePhone: otherSettings.sharePhone,
              shareWhatsapp: otherSettings.shareWhatsapp,
              shareLocation: otherSettings.shareLocation,
            }
          : null,
      };
    });

    return NextResponse.json({ success: true, connections });
  } catch (error: any) {
    console.error('Connections list error:', error);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}
