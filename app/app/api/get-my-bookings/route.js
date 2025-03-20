import { PrismaClient } from "@prisma/client";
import { getServerSession } from 'next-auth/next';
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET(){
  const db = new PrismaClient();
  const session = await getServerSession(authOptions);
  const userId = session.user.id;
  try{

    const myBookings = await db.payments.findMany({
      where: {
        user_id: parseInt(userId),
      },
      include: {
        bookings: {
          include: {
            duration: true, 
            services: {
              include: {
                services_location: { 
                  include: {
                    location: true, 
                  },
                },
              },
            },
          },
        },
      },
    });
    

    
    const allData = myBookings.flatMap((payment) =>
      payment.bookings.map((booking) => ({
        payment_id: payment.payment_id,
        value: payment.value,
        date: payment.date,
        status: payment.status,
        method: payment.method,
        booking_id: booking.booking_id,
        booking_status: booking.status,
        booking_day: booking.duration.booking_day,
        final_price: booking.final_price,
        service_name: booking.services?.name, 
        service_description: booking.services?.description, 
        service_price: booking.services?.price,
        service_location: booking.services.services_location[0]?.location?.city,
        service_address: booking.services.services_location[0]?.location?.address,
        booking_start_time: booking.duration.start_time
   
        
      }))
    );


    

    return new Response(
      JSON.stringify(allData),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  }catch(error){
    JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
  }finally{
    await db.$disconnect();
  }

}