
import { PrismaClient } from "@prisma/client";


const prisma = new PrismaClient();

export async function GET(request, { params }) {
  try {

    const { id } = await params;
    console.log("route id", id)
 

    if (!id || isNaN(Number(id))) {
      return new Response(
        JSON.stringify({ error: "Invalid ID parameter" }),
        { status: 400 } 
      );
    }




    const service = await prisma.services.findUnique({
      where: { service_id: Number(id) },
      include: {
        duration: true,
        images: true,
        services_location: {
          include:{
            location: true
          }
        }
      }
    });


    console.log(service)
    if (!service) {
      return new Response(
        JSON.stringify({ error: "Service not found" }),
        { status: 404 } // 404 Not Found
      );
    }
    
    const allData = service
    ? 
        {
          service_id: service.service_id,
          user_id: service.user_id,
          service_name: service.name,
          service_description: service.description,
          service_price: service.price,
          duration_id: service.duration[0]?.duration_id,
          duration_start_time: service.duration[0]?.start_time,
          duration_end_time: service.duration[0]?.end_time,
          images: service.images.map(img => ({
            image_id: img.image_id,
            path: img.path
          })),
          location_id: service.services_location[0]?.location?.location_id,
          postal_code: service.services_location[0]?.location?.postal_code,
          county: service.services_location[0]?.location?.county,
          service_location: service.services_location[0]?.location?.city,
          service_address: service.services_location[0]?.location?.address,
          days_available: service.duration[0]?.service_days_available,
          service_rating: service?.average_rating
        }
      
    : [];
    



    return new Response(
      JSON.stringify(allData),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error fetching service:", error);
    return new Response(
      JSON.stringify({ error: "Internal Server Error" }),
      { status: 500 } // 500 Internal Server Error
    );
  }finally{
    await prisma.$disconnect();
  }
}
