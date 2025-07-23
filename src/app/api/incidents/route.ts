// app/api/incidents/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET() {
  try {
    const incidents = await prisma.incident.findMany({
      where: {
        resolved: false,
      },
      orderBy: {
        tsStart: 'desc', // Return newest incidents first
      },
      include: {
        camera: true, // Include related camera information
      },
    });
    return NextResponse.json(incidents);
  } catch (error) {
    console.error('Error fetching incidents:', error);
    return NextResponse.json(
      { message: 'An error occurred while fetching incidents.' },
      { status: 500 }
    );
  }
}