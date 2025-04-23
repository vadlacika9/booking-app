import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

export async function DELETE(request) {
  try {
    const body = await request.json();
    console.log('Request Body:', body);

    const { location_id, service_id, duration_id, image_id } = body;

    
    const deleteService = await db.$transaction([
      
      
      db.duration.deleteMany({
        where: {
          duration_id: Number(duration_id)
        }
      }),

       db.bookings.deleteMany({
        where: {
          service_id: Number(service_id)
        }
      }),

       db.duration.deleteMany({
        where: {
          service_id: Number(service_id)
        }
      }),
     
        db.services_location.deleteMany({
        where: {
          service_id: Number(service_id),
          location_id: Number(location_id)
        }
      }),

      
      db.images.deleteMany({
        where: {
          service_id: Number(service_id)
        }
      }),

      db.location.deleteMany({
        where: {
          location_id: Number(location_id)
        }
      }),

      db.services_category.deleteMany({
        where:{
          service_id: Number(service_id)
        }
      }),

      db.feedback.deleteMany({
        where:{
          service_id:Number(service_id)
        }
      }),
   
      db.services.deleteMany({
        where: {
          service_id: Number(service_id)
        }
      })
    ]);

  
    return new Response(
      JSON.stringify({ message: "Service deleted successfully along with all related data!" }), 
      { status: 200, headers: { "Content-Type": "application/json" } }
    );

  } catch (error) {
   
    return new Response(
      JSON.stringify({ error: `Error deleting service: ${error.message}` }), 
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }finally{
    await db.$disconnect();
  }
}
