// app/api/cameras/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET() {
  try {
    const cameras = await prisma.camera.findMany();
    return NextResponse.json(cameras);
  } catch (error) {
    console.error('Error fetching cameras:', error);
    return NextResponse.json(
      { message: 'An error occurred while fetching cameras.' },
      { status: 500 }
    );
  }
}