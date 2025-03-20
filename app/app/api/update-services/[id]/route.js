import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PUT(request) {
  try {
    const body = await request.json();
    const { service_id, user_id, service_name, service_description, service_price, duration_id, duration_start_time, duration_end_time, images, service_location, service_address, days_available, location_id, postal_code, county, image_id } = body;

   
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
      prisma.images.update({
        where: { image_id },
        data: { path: images },
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
    await db.$disconnect();
  }
}
