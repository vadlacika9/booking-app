import { PrismaClient } from "@prisma/client";

const db = new PrismaClient

export async function POST(request){
  try{
    const body = await request.json();
    if(body){
      console.log(body);
    }
    const {locationNames} = body;

    const nearestPlaces = await db.location.findMany({
      where:{
        city:{
          in: locationNames
        }
      },
      include: {
        services_location: {
          include : {
            services : {
              include: {
                images: true
              }
            }
             
          }
        }
      }
    })



    const formattedServices = nearestPlaces.map(service => ({
      service_id: service.services_location[0].services.service_id || null,
      service_name: service.services_location[0].services.name || null,
      service_description: service.services_location[0].services.description || null,
      service_price: service.services_location[0].services.price || null,
      images: [service.services_location[0].services.images[0].path] || ['https://ceouekx9cbptssme.public.blob.vercel-storage.com/default-oCOnxEAVLnQCAxCIb9R87WUp5jLrTP.png'],
      location_id: service.location_id || null,
      postal_code: service.postal_code || null,
      county: service.county || null,
      service_location: service.city || null,
      service_address: service.address || null ,
      service_avg_rating :Number(service.services_location[0].services.average_rating) || null
    }))

   

    return new Response(
      JSON.stringify(formattedServices),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  }catch(error){
    console.error("Error fetching nearest places:", error);
    return new Response(
      JSON.stringify({ error: "Internal Server Error" }),
      { status: 500 }
    );
  }finally{
    await db.$disconnect()
  }


}