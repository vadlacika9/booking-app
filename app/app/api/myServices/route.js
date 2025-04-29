import { PrismaClient } from "@prisma/client";
import { getServerSession } from 'next-auth/next';
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET() {
  const session = await getServerSession(authOptions);
  console.log(session);
  const db = new PrismaClient();
  const id = session.user.id;
  console.log(id);

  try {
    const myServices = await db.services.findMany({
      where: {
        user_id: parseInt(id), 
      },
      include: {
        duration: true, 
        images: true, 
        services_location: {
          include: {
            location: true, 
          }
        }
      }
    });
 
    const servicesWithFormattedData = myServices.map((service) => ({
      service_id: service.service_id,
      user_id: service.user_id,
      service_name: service.name,
      service_description: service.description,
      service_price: service.price,
  
      duration_id: service.duration[0]?.duration_id,
      duration_start_time: service.duration[0]?.start_time,
      duration_end_time: service.duration[0]?.end_time,

      images : {image_id: service.images.length > 0 ? service.images[0].image_id : null,
      images: service.images.length > 0
        ? service.images.map((img) => img.path) 
        : [
            'https://ceouekx9cbptssme.public.blob.vercel-storage.com/default-NIiwIB7QvsHFa1RVneC6dHZdSQIrAs.png', 
          ],},
   
      location: {
        location_id: service.services_location[0]?.location?.location_id,
        postal_code: service.services_location[0]?.location?.postal_code,
        county: service.services_location[0]?.location?.county,
        city: service.services_location[0]?.location?.city,
        address: service.services_location[0]?.location?.address,
      },
      days_available: service.duration[0]?.service_days_available,
    }));

    return new Response(
      JSON.stringify(servicesWithFormattedData),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }finally{
    await db.$disconnect();
  }

}
