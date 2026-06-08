import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import prisma from '@/lib/db';
import { verifyJWT } from '@/lib/auth';

async function verifyAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get('pertap_jwt')?.value;
  if (!token) return null;

  const payload = await verifyJWT(token);
  if (!payload) return null;

  const user = await prisma.user.findUnique({
    where: { id: payload.userId }
  });

  if (!user || user.email !== process.env.ADMIN_EMAIL) {
    return null;
  }

  return user;
}

export async function GET() {
  try {
    const admin = await verifyAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    // Total connections
    const totalConnections = await prisma.connection.count({
      where: { status: 'accepted' }
    });

    // Connections today
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const connectionsToday = await prisma.connection.count({
      where: {
        status: 'accepted',
        createdAt: { gte: startOfToday }
      }
    });

    // Connection breakdown by via type
    const nfcConnections = await prisma.connection.count({
      where: { status: 'accepted', via: 'nfc' }
    });
    const qrConnections = await prisma.connection.count({
      where: { status: 'accepted', via: 'qr' }
    });
    const linkConnections = await prisma.connection.count({
      where: { status: 'accepted', via: 'link' }
    });

    // Top connected users
    const allAccepted = await prisma.connection.findMany({
      where: { status: 'accepted' },
      select: { requesterId: true, receiverId: true }
    });

    const userCounts: Record<number, number> = {};
    for (const conn of allAccepted) {
      userCounts[conn.requesterId] = (userCounts[conn.requesterId] || 0) + 1;
      userCounts[conn.receiverId] = (userCounts[conn.receiverId] || 0) + 1;
    }

    const sortedUsers = Object.entries(userCounts)
      .map(([userId, count]) => ({ userId: parseInt(userId, 10), count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    const topUsers = [];
    for (const u of sortedUsers) {
      const profile = await prisma.profile.findUnique({
        where: { userId: u.userId },
        select: { name: true, username: true, avatar: true }
      });
      if (profile) {
        topUsers.push({
          userId: u.userId,
          name: profile.name,
          username: profile.username,
          avatar: profile.avatar,
          count: u.count
        });
      }
    }

    return NextResponse.json({
      success: true,
      stats: {
        totalConnections,
        connectionsToday,
        nfcConnections,
        qrConnections,
        linkConnections,
        topUsers
      }
    });
  } catch (error: any) {
    console.error('Connection stats error:', error);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}

export async function POST() {
  try {
    const admin = await verifyAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const users = await prisma.user.findMany({
      select: { id: true },
    });

    let reconciledCount = 0;
    for (const user of users) {
      const actualCount = await prisma.connection.count({
        where: {
          status: 'accepted',
          OR: [
            { requesterId: user.id },
            { receiverId: user.id },
          ],
        },
      });

      await prisma.user.update({
        where: { id: user.id },
        data: { connectionCount: actualCount },
      });
      reconciledCount++;
    }

    return NextResponse.json({
      success: true,
      message: `Reconciled connection counts for ${reconciledCount} users.`,
    });
  } catch (error: any) {
    console.error('Connection reconciliation error:', error);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}
