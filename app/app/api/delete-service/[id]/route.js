import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

export async function DELETE(request) {
  try {
    const body = await request.json();
    console.log('Request Body:', body);

    const { location_id, service_id, duration_id, image_id } = body;
  
    console.log('Location ID:', location_id);
    console.log('Service ID:', service_id);
    console.log('Duration ID:', duration_id);
    console.log('Image ID:', image_id);

    // Törlés lépései egyenkénti üzenetekkel
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
     

      // Töröljük a kapcsolódó `bookings` rekordokat
     

      

      // Töröljük a kapcsolódó `services_location` rekordokat
        db.services_location.deleteMany({
        where: {
          service_id: Number(service_id),
          location_id: Number(location_id)
        }
      }),

      // Töröljük az `images` rekordot
      db.images.deleteMany({
        where: {
          image_id: Number(image_id)
        }
      }),

      // Töröljük a `duration` rekordot
      

      // Töröljük a `location` rekordot
      db.location.deleteMany({
        where: {
          location_id: Number(location_id)
        }
      }),

      // Töröljük a fő `service` rekordot
      db.services.deleteMany({
        where: {
          service_id: Number(service_id)
        }
      })
    ]);

    // Visszaadjuk a sikeres törlés üzenetet
    return new Response(
      JSON.stringify({ message: "Service deleted successfully along with all related data!" }), // Egyéni üzenet
      { status: 200, headers: { "Content-Type": "application/json" } }
    );

  } catch (error) {
    // Ha valami hiba történik, visszaadjuk a hibaüzenetet
    return new Response(
      JSON.stringify({ error: `Error deleting service: ${error.message}` }), // Hibás üzenet
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
