import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route"
import { sendEmail } from "@/utils/mailer";


export async function POST(request) {
  const db = new PrismaClient();
  const session = await getServerSession(authOptions);

  if(!session){
    return new Response(
      JSON.stringify({ error: "No session" }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    );
  }

  const email = session.user.email;

  try {
  

    
    const body = await request.json();
    if(body)
      {console.log("body",body)}
    
    const { servicePrice, selectedSlot, value, serviceId, userId } = body;
    console.log(serviceId)
    console.log(servicePrice)
    console.log(value)
    console.log(selectedSlot)
 

    if (!servicePrice || !selectedSlot || !value || !serviceId) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

   
    console.log(userId)
  

    const createPayment = await db.payments.create({
      data: {
        value: Number(servicePrice),
        status: "payed",
        method: "card",
        user_id: Number(userId),
      },
    });

    const paymentId = createPayment.payment_id;

    const createDuration = await db.duration.create({
      data: {
        start_time: selectedSlot,
        service_id: Number(serviceId),
        booking_day: value
      },
    });

    const durationId = createDuration.duration_id;

    const createBookings = await db.bookings.create({
      data: {
        status: "processing",
        final_price: Number(servicePrice),
        service_id: Number(serviceId),
        payment_id: Number(paymentId),
        duration_id: Number(durationId),
      },
    });

    const emailres = await sendEmail({email, emailType: "BOOKING",
          userId: userId
        })

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
    await db.$disconnect();
  }
}
