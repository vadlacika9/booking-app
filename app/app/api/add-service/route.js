
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";


export async function POST(request) {
  const db = new PrismaClient();
   const session = await getServerSession(authOptions);
   const userId = session.user.id;
  try {
    const body = await request.json();
    const { serviceName, serviceDesc, servicePrice, serviceCounty, serviceCity, serviceAddress, servicePostal, image, startTime, endTime, availableDays } = body;
    console.log(body);
    // Adatok validálása
    if (!serviceName || !serviceDesc || !servicePrice || !serviceCounty || !serviceCity || !serviceAddress || !servicePostal || !image || !startTime || !endTime || !availableDays) {
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


    // Első beszúrás a Location táblába
    /*const sql1 = 'INSERT INTO Location (city, postal_code, county, address) VALUES (?, ?, ?, ?)';
    const values1 = [serviceCity, servicePostal, serviceCounty, serviceAddress];
    const locInsert = await query({ query: sql1, values: values1 });*/

    const locId = createLocation.location_id; // Az első táblából származó ID

    // Második beszúrás a Services táblába

    const createService = await db.services.create({
      data:{
        name: serviceName,
        description: serviceDesc,
        price: parseFloat(servicePrice),
        user_id: userId,
        phone_number: ''

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

    /*const sql2 = 'INSERT INTO Services (name, description, price, location_id, user_id) VALUES (?, ?, ?, ?, ?)';
    const values2 = [serviceName, serviceDesc, servicePrice, locId, 1];
    await query({ query: sql2, values: values2 });*/

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
  }
}

