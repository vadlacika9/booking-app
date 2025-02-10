/*import { PrismaClient } from "@prisma/client";
import { getServerSession } from 'next-auth/next';
import { authOptions } from "../auth/[...nextauth]/route";


export async function GET(request, { params }){
  const session = await getServerSession(authOptions);
  
  const db = new PrismaClient();
  const { id } = params;

  try{

  
  const myServices = await db.services.findMany({
    where: {
      service_id: parseInt(id)
    }
  })
  return new Response(
    JSON.stringify(myServices),
    {status: 200, headers: {'Content-Type' : 'application/json'}}
  );
}catch(error){
  JSON.stringify({ error: error.message }),
    { status: 500, headers: { 'Content-Type': 'application/json' } }
}
}
*/

import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";

const prisma = new PrismaClient();

export async function GET(request, { params }) {
  try {
    // Ellenőrizzük a dinamikusan kapott ID-t
    const { id } = await params;
    console.log("Requested ID:", id);

    if (!id || isNaN(Number(id))) {
      return new Response(
        JSON.stringify({ error: "Invalid ID parameter" }),
        { status: 400 } // 400 Bad Request
      );
    }

    // Ellenőrizzük a session-t, ha szükséges
    /*const session = await getServerSession(authOptions);
    if (!session) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401 } // 401 Unauthorized
      );
    }*/

    // Prisma lekérdezés az adott ID alapján
    const service = await prisma.services.findUnique({
      where: { service_id: Number(id) },
    });

    // Ha nem található az adat
    if (!service) {
      return new Response(
        JSON.stringify({ error: "Service not found" }),
        { status: 404 } // 404 Not Found
      );
    }
    
    const serviceImages = await prisma.images.findMany({
      where: {
        service_id: Number(id),
        type: 'service',
      },
    });

    const serviceWithLocation = await prisma.services_location.findMany({
      where: {
        service_id: Number(id),
      },
      include: {
        services: true, // Ha a szolgáltatás adatait is szeretnéd betölteni
        location: true, // Ha a helyszín adatokat is szeretnéd betölteni
      },
    });
    

      
      const images = serviceImages.length > 0 
      ? serviceImages.map(img => img.path) // Ha van több kép, egy tömbben küldjük vissza
      : ['https://ceouekx9cbptssme.public.blob.vercel-storage.com/default-oCOnxEAVLnQCAxCIb9R87WUp5jLrTP.png']; // Alapértelmezett kép


    const servicesWithImages = {
      ...service,
      images,
      location: serviceWithLocation[0].location
    };
 
    
    
    console.log(servicesWithImages);

    // Sikeres válasz
    return new Response(
      JSON.stringify(servicesWithImages),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error fetching service:", error);
    return new Response(
      JSON.stringify({ error: "Internal Server Error" }),
      { status: 500 } // 500 Internal Server Error
    );
  }
}
