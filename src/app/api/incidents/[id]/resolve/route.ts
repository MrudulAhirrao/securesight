// src/app/api/incidents/[id]/resolve/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function PATCH(request: NextRequest) {
  const url = new URL(request.url);
  const id = url.pathname.split('/').slice(-2)[0]; // extracts [id] from path

  try {
    const updatedIncident = await prisma.incident.update({
      where: {
        id: id,
      },
      data: {
        resolved: true,
      },
    });

    return NextResponse.json(updatedIncident);
  } catch (error) {
    console.error(`Error resolving incident ${id}:`, error);
    return NextResponse.json(
      { message: 'An error occurred while resolving the incident.' },
      { status: 500 }
    );
  }
}
