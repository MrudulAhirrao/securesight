// app/api/incidents/add/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function POST() {
  try {
    const cameras = await prisma.camera.findMany();
    if (cameras.length === 0) throw new Error('No cameras found');

    const incidentTypes = ['Unauthorised Access', 'Gun Threat', 'Face Recognised', 'Fire Hazard'];
    const newIncidentsData = [];

    for (let i = 0; i < 5; i++) {
      const randomCamera = cameras[Math.floor(Math.random() * cameras.length)];
      const randomType = incidentTypes[Math.floor(Math.random() * incidentTypes.length)];
      const startTime = new Date(Date.now() - Math.floor(Math.random() * 60 * 1000));
      const endTime = new Date(startTime.getTime() + Math.floor(Math.random() * 120 * 1000));

      newIncidentsData.push({
        type: randomType, tsStart: startTime, tsEnd: endTime,
        thumbnailUrl: `https://picsum.photos/seed/${i + Math.random()}/300/200`,
        resolved: false, cameraId: randomCamera.id,
      });
    }

    await prisma.incident.createMany({ data: newIncidentsData });
    
    // Simply return a success message
    return NextResponse.json({ success: true, count: newIncidentsData.length });
  } catch (error) {
    console.error("Error in add incidents API:", error)
    return NextResponse.json({ message: 'Failed to add incidents' }, { status: 500 });
  }
}