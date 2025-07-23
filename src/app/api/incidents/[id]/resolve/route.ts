import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

// CORRECTED function signature
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    const updatedIncident = await prisma.incident.update({
      where: { id: id },
      data: { resolved: true },
    });
    return NextResponse.json(updatedIncident);
  } catch (error) {
    console.error(`Error resolving incident ${id}:`, error);
    return NextResponse.json({ message: 'An error occurred' }, { status: 500 });
  }
}