import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { name, email, password, username: rawUsername } = await request.json();

    if (!name || !email || !password || !rawUsername) {
      return NextResponse.json({ error: 'Name, email, password, and username are required.' }, { status: 400 });
    }

    const username = rawUsername.toLowerCase().trim();
    if (!/^[a-z0-9_-]{3,20}$/.test(username)) {
      return NextResponse.json({ error: 'Username must be 3-20 characters long and contain only lowercase letters, numbers, hyphens, or underscores.' }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: 'User with this email already exists.' }, { status: 400 });
    }

    const existingProfile = await prisma.profile.findUnique({ where: { username } });
    if (existingProfile) {
      return NextResponse.json({ error: 'Username is already taken.' }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        profile: {
          create: {
            name,
            username,
            tagline: "Let's connect!",
            avatar: "/profile_avatar.png",
            bio: "I design meaningful experiences.",
            diamonds: "0",
            isPremium: false,
            tapCount: 0,
            tags: {
              createMany: {
                data: [
                  { text: 'Creator', type: 'role' },
                  { text: 'Earth', type: 'location' }
                ]
              }
            }
          }
        },
        sharingSettings: {
          create: {
            shareName: true,
            shareEmail: true,
            sharePhone: false,
            shareWhatsapp: true,
            shareLocation: false
          }
        }
      }
    });

    return NextResponse.json({ success: true, message: 'User registered successfully!' }, { status: 201 });
  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}
