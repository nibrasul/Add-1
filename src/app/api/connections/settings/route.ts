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

    let settings = await prisma.sharingSettings.findUnique({
      where: { userId: payload.userId }
    });

    if (!settings) {
      settings = await prisma.sharingSettings.create({
        data: {
          userId: payload.userId,
          shareName: true,
          shareEmail: true,
          sharePhone: false,
          shareWhatsapp: true,
          shareLocation: false
        }
      });
    }

    return NextResponse.json({ success: true, settings });
  } catch (error: any) {
    console.error('Get sharing settings error:', error);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('pertap_jwt')?.value;
    if (!token) return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 });

    const payload = await verifyJWT(token);
    if (!payload) return NextResponse.json({ error: 'Invalid token.' }, { status: 401 });

    const { shareName, shareEmail, sharePhone, shareWhatsapp, shareLocation } = await request.json();

    const settings = await prisma.sharingSettings.upsert({
      where: { userId: payload.userId },
      create: {
        userId: payload.userId,
        shareName: shareName ?? true,
        shareEmail: shareEmail ?? true,
        sharePhone: sharePhone ?? false,
        shareWhatsapp: shareWhatsapp ?? true,
        shareLocation: shareLocation ?? false
      },
      update: {
        shareName: shareName !== undefined ? shareName : undefined,
        shareEmail: shareEmail !== undefined ? shareEmail : undefined,
        sharePhone: sharePhone !== undefined ? sharePhone : undefined,
        shareWhatsapp: shareWhatsapp !== undefined ? shareWhatsapp : undefined,
        shareLocation: shareLocation !== undefined ? shareLocation : undefined
      }
    });

    return NextResponse.json({ success: true, settings });
  } catch (error: any) {
    console.error('Update sharing settings error:', error);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}
