import { PrismaClient } from "@prisma/client";

export async function GET(request, { params }) {
  const { id } = await params;
  const serviceId = Number(id);
  
  if (isNaN(serviceId)) {
    return new Response(
      JSON.stringify({ error: "Invalid service ID" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const db = new PrismaClient();

  try {
    const bookings = await db.bookings.findMany({
      where: {
        service_id: serviceId
      },
      include: {
        duration: true,
        services: true,
        payments: {
          include:{
            users : true
          }
        }
      }
    });

    if (!bookings || bookings.length === 0) {
      return new Response(
        JSON.stringify({ error: "No bookings found for this service." }),
        { status: 404 }
      );
    }

    const allData = bookings.map(booking => ({
      booking_id: booking.booking_id,
      price: booking.final_price,
      service_id: booking.service_id,
      service_name: booking.services?.name || "Unknown",
      service_phone_number: booking.services?.phone_number || "Unknown",
      booking_start_time: booking.duration?.start_time || "N/A",
      booking_day: booking.duration?.booking_day || "N/A",
      user_id: booking.payments?.user_id || "N/A",
      first_name: booking.payments?.users?.first_name,
      last_name: booking.payments?.users?.last_name,
    }));

    return new Response(
      JSON.stringify(allData),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error fetching service:", error);
    return new Response(
      JSON.stringify({ error: "Internal Server Error" }),
      { status: 500 }
    );
  }finally{
    await db.$disconnect();
  }
}
