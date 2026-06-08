import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import prisma from '@/lib/db';
import { verifyJWT } from '@/lib/auth';
import { rateLimit } from '@/lib/rate-limit';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';

    // Check IP rate limit first: max 30 connection status checks per IP per minute
    if (!rateLimit(`status-ip:${ip}`, 30)) {
      return NextResponse.json({ error: 'Too many requests.' }, { status: 429 });
    }

    const { username } = await params;
    if (!username) {
      return NextResponse.json({ error: 'Username is required.' }, { status: 400 });
    }

    const slug = username.toLowerCase().trim();
    const targetProfile = await prisma.profile.findUnique({
      where: { username: slug },
      select: { userId: true },
    });

    if (!targetProfile) {
      return NextResponse.json({ error: 'User not found.' }, { status: 404 });
    }

    let connectionStatus: string | null = null;
    let connectionId: number | null = null;

    const cookieStore = await cookies();
    const token = cookieStore.get('pertap_jwt')?.value;
    if (token) {
      const payload = await verifyJWT(token);
      if (payload) {
        if (!rateLimit(`status-user:${payload.userId}`, 60)) {
          return NextResponse.json({ error: 'Too many requests.' }, { status: 429 });
        }
        if (payload.userId === targetProfile.userId) {
          connectionStatus = 'accepted'; // Cannot connect with self
        } else {
          const conn = await prisma.connection.findFirst({
            where: {
              OR: [
                { requesterId: payload.userId, receiverId: targetProfile.userId },
                { requesterId: targetProfile.userId, receiverId: payload.userId },
              ],
            },
          });
          if (conn) {
            connectionStatus = conn.status;
            connectionId = conn.id;
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      connectionStatus,
      connectionId,
    });
  } catch (error: any) {
    console.error('API Connection Status Error:', error);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}
