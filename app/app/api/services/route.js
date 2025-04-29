
import { PrismaClient } from "@prisma/client";


const prisma = new PrismaClient();

export async function GET() {
  try {

    const allServices = await prisma.services.findMany({
      include: {
        duration: true,
        images: true,
        services_location: {
          include: {
            location: true
          }
        },
        service_category: {
          include: {
            category:true
          }
        }
      }
    });


    if (!allServices.length) {
      return new Response(
        JSON.stringify({ error: "No services found" }),
        { status: 404 } // 404 Not Found
      );
    }


    const formattedServices = allServices.map(service => ({
      service_id: service.service_id,
      user_id: service.user_id,
      service_name: service.name,
      service_description: service.description,
      service_price: service.price,
      duration_id: service.duration[0]?.duration_id || null,
      duration_start_time: service.duration[0]?.start_time || null,
      duration_end_time: service.duration[0]?.end_time || null,
      images: service.images.length
        ? service.images.map(img => img.path)
        : ['https://ceouekx9cbptssme.public.blob.vercel-storage.com/default-NIiwIB7QvsHFa1RVneC6dHZdSQIrAs.png'],
      location_id: service.services_location[0]?.location?.location_id || null,
      postal_code: service.services_location[0]?.location?.postal_code || null,
      county: service.services_location[0]?.location?.county || null,
      service_location: service.services_location[0]?.location?.city || null,
      service_address: service.services_location[0]?.location?.address || null,
      days_available: service.duration[0]?.service_days_available || [],
      service_avg_rating : service?.service_avg_rating,
      category_id: service.service_category[0]?.category_id ||null,
      category_name: service.service_category[0]?.category?.name ||null
    }));
    
  
    return new Response(
      JSON.stringify(formattedServices),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error fetching services:", error);
    return new Response(
      JSON.stringify({ error: "Internal Server Error" }),
      { status: 500 } // 500 Internal Server Error
    );
  }finally{
    await prisma.$disconnect();
  }
}
