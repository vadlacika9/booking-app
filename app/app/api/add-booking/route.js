import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function POST(request) {
  const db = new PrismaClient();
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized user" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    const body = await request.json();
    const { servicePrice, selectedSlot, value, serviceId } = body;

    if (!servicePrice || !selectedSlot || !value || !serviceId) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const userId = session.user.id;

    const createPayment = await db.payments.create({
      data: {
        value: servicePrice,
        status: "processing",
        method: "online",
        user_id: userId,
      },
    });

    const paymentId = createPayment.payment_id;

    const createDuration = await db.duration.create({
      data: {
        start_time: selectedSlot,
        service_id: serviceId,
        booking_day: value
      },
    });

    const durationId = createDuration.duration_id;

    const createBookings = await db.bookings.create({
      data: {
        status: "processing",
        final_price: servicePrice,
        service_id: serviceId,
        payment_id: paymentId,
        duration_id: durationId,
      },
    });

    return new Response(
      JSON.stringify({ message: "Booking inserted successfully!" }),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  } finally {
    await db.$disconnect(); // Kapcsolódás bezárása
  }
}
