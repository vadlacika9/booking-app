import { PrismaClient } from '@prisma/client';

export async function GET(req) {
  const db = new PrismaClient();
  const { searchParams } = new URL(req.url);
  const date = searchParams.get("date");
  const serviceId = searchParams.get("serviceId");

  
  if (!date || !serviceId) {
    return new Response(
      JSON.stringify({ error: "Missing required parameters: date or serviceId" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  try {

    const bookedSlots = await db.duration.findMany({
      where: {
        booking_day: date,
        service_id: parseInt(serviceId), 
      },
      select: {
        start_time: true, 
      },
    });


    if (!bookedSlots || bookedSlots.length === 0) {
      return new Response(
        JSON.stringify({ bookedSlots: [] }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }


    const formattedSlots = bookedSlots.map((slot) => slot.start_time);
    console.log(formattedSlots);
    return new Response(
      JSON.stringify({ bookedSlots: formattedSlots }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
    
  } catch (error) {
    console.error("Database query failed:", error);
    return new Response(
      JSON.stringify({ error: "Internal Server Error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  } finally {
    await db.$disconnect(); 
  }
}
