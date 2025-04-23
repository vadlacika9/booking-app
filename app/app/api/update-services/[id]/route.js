import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PUT(request) {
  try {
    const body = await request.json();
    const { service_id, user_id, service_name, service_description, service_price, duration_id, duration_start_time, duration_end_time, images, service_location, service_address, days_available, location_id, postal_code, county, image_id } = body;

   console.log("allimages", images)

   const existingImages = await prisma.images.findMany({
    where: {
      path: {
        in: images,
      },
    },
    select: {
      path: true,
    },
  });

  const existingPaths = existingImages.map(img => img.path);

// 2. Új path-ok kiszűrése
const newImagePaths = images.filter(path => !existingPaths.includes(path));

if (newImagePaths.length > 0) {
  await prisma.images.createMany({
    data: newImagePaths.map(path => ({ path, service_id:service_id, type:"service" })),
    skipDuplicates: true,
  });
}
    const updatedData = await prisma.$transaction([
      prisma.location.update({
        where: { location_id },
        data: {
          city: service_location,
          postal_code,
          county,
          address: service_address,
        },
      }),
      prisma.services.update({
        where: { service_id },
        data: {
          name: service_name,
          description: service_description,
          price: Number(service_price),
        },
      }),
      
      
      prisma.duration.update({
        where: { duration_id },
        data: {
          start_time: duration_start_time,
          end_time: duration_end_time,
          service_days_available: days_available,
        },
      }),
    ]);

    return new Response(
      JSON.stringify({ message: "Service updated successfully", updatedData }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }finally{
    await prisma.$disconnect();
  }
}
