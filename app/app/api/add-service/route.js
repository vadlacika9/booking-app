
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { sendEmail } from "@/utils/mailer";

export async function POST(request) {
  const db = new PrismaClient();
   const session = await getServerSession(authOptions);
   const userId = session.user.id;
   const email = session.user.email;
  try {
    const body = await request.json();
    const { serviceName, serviceDesc, servicePrice, serviceCounty, serviceCity, serviceAddress, servicePostal, image, startTime, endTime, availableDays ,phoneNumber, selectedCategory} = body;
    console.log(body);
    // validating data
    
    if (!serviceName || !serviceDesc || !servicePrice || !serviceCounty || !serviceCity || !serviceAddress || !servicePostal || !image || !startTime || !endTime || !availableDays || !phoneNumber || !selectedCategory) {
      return new Response(
        JSON.stringify({ error: 'Minden mező kitöltése kötelező!' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    const createLocation = await db.location.create({
      data:{
        city: serviceCity,
        postal_code: servicePostal,
        county: serviceCounty,
        address: serviceAddress
      }
    })

    const locId = createLocation.location_id; 

 

    const createService = await db.services.create({
      data:{
        name: serviceName,
        description: serviceDesc,
        price: parseFloat(servicePrice),
        user_id: userId,
        phone_number: phoneNumber

      }
    })
    const servId = createService.service_id;

    const createConnection = await db.services_location.create({
      data:{
        location_id: locId,
        service_id: servId
      }
    })

    const createImage = await db.images.create({
      data:{
        type: 'service',
        service_id: servId,
        path: image || "https://ceouekx9cbptssme.public.blob.vercel-storage.com/Screenshot%202024-02-04%20144520-FB6A8u4IVY2Dc9LReBnsBwDbLCkYpV.png"
      }
    })

    const createDuration = await db.duration.create({
      data:{
        start_time: startTime,
        end_time: endTime,
        service_id: servId,
        exception_id: null,
        service_days_available: availableDays
      }
    })

    const createServiceCategory = await db.services_category.create({
      data:{
        service_id:Number(servId),
        category_id:Number(selectedCategory)
      }
    })
    
    const emailres = await sendEmail({email, emailType: "SERVICE",
      userId: userId
    })


    return new Response(
      JSON.stringify({ message: 'Service inserted successfully!' }),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
      
    );

  } catch (error) {
    console.error('Hiba történt:', error.message);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }finally{
    await db.$disconnect();
  }
}

