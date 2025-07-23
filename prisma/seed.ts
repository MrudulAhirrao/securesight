import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log(`Start seeding ...`);

  await prisma.incident.deleteMany();
  await prisma.camera.deleteMany();
  console.log('Old data deleted.');

  const camerasData = [
    { name: 'Camera 01', location: 'Shop Floor A' },
    { name: 'Camera 02', location: 'Vault' },
    { name: 'Camera 03', location: 'Entrance' },
  ];
  await prisma.camera.createMany({ data: camerasData });
  const cameras = await prisma.camera.findMany();
  console.log(`Created ${cameras.length} cameras.`);

  const incidentTypes = ['Unauthorised Access', 'Gun Threat', 'Face Recognised', 'Fire Hazard'];
  const incidentsData = [];

  for (let i = 0; i < 12; i++) {
    const randomCamera = cameras[Math.floor(Math.random() * cameras.length)];
    const randomType = incidentTypes[Math.floor(Math.random() * incidentTypes.length)];
    const startTime = new Date(Date.now() - Math.floor(Math.random() * 24 * 60 * 60 * 1000));
    const endTime = new Date(startTime.getTime() + Math.floor(Math.random() * 5 * 60 * 1000));
    
    incidentsData.push({
      type: randomType,
      tsStart: startTime,
      tsEnd: endTime,
      thumbnailUrl: `https://picsum.photos/seed/${i + Math.random()}/300/200`, // UPDATED
      resolved: false,
      cameraId: randomCamera.id,
    });
  }

  await prisma.incident.createMany({ data: incidentsData });
  console.log(`Created ${incidentsData.length} new unresolved incidents.`);
  console.log(`Seeding finished.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });