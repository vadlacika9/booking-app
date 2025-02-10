
/*import { PrismaClient } from "@prisma/client";

export async function GET(){
  try{
    const sql = "SELECT * FROM services";
    const services = await query({query: sql});
    console.log(services);
    return new Response(
      JSON.stringify(services),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );


  }catch(error){
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );

    const db = new PrismaClient();

    const allServices = await db.services.findMany();

    const servicesWithImages = await Promise.all(allServices.map(async (service) => {
      const serviceImages = await db.images.findMany({
        where: {
          service_id: service.service_id,
          type: 'service'
        }
      });
      
      
      console.log(serviceWithLocation)

      return {
        ...service,
        images: serviceImages.length ? serviceImages.map(img => img.path) : ['https://ceouekx9cbptssme.public.blob.vercel-storage.com/default-oCOnxEAVLnQCAxCIb9R87WUp5jLrTP.png'],
        
      };
    }));

  

    return new Response(
      JSON.stringify(servicesWithImages),
      {status: 200, headers: {'Content-Type' : 'application/json'}}
    );
  }catch(error){
    JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
  }
}*/

import { PrismaClient } from "@prisma/client";

export async function GET() {
  try {
    const db = new PrismaClient();

    // Az összes szolgáltatás lekérése
    const allServices = await db.services.findMany();

    // Minden szolgáltatás képeit és a hozzá tartozó helyszínt csatoljuk
    const servicesWithImagesAndLocation = await Promise.all(allServices.map(async (service) => {
      // Szolgáltatás képeinek lekérése
      const serviceImages = await db.images.findMany({
        where: {
          service_id: service.service_id,
          type: 'service',
        },
      });

      // Csak az adott szolgáltatáshoz tartozó helyszín lekérése
      const serviceLocation = await db.services_location.findFirst({
        where: {
          service_id: service.service_id, // Kiválasztjuk a megfelelő szolgáltatást
        },
        include: {
          location: true,  // Az aktuális szolgáltatáshoz tartozó helyszínt betöltjük
        },
      });

      // Ha találunk hozzá helyszínt
      const location = serviceLocation ? serviceLocation.location : null;

      // Hozzáadjuk a szolgáltatás adataihoz a képeket és a helyszínt
      return {
        ...service,
        images: serviceImages.length 
          ? serviceImages.map(img => img.path) 
          : ['https://ceouekx9cbptssme.public.blob.vercel-storage.com/default-oCOnxEAVLnQCAxCIb9R87WUp5jLrTP.png'],
        location: location,  // A hozzá tartozó helyszín
      };
    }));

    console.log(servicesWithImagesAndLocation)
    // Válasz visszaadása
    return new Response(
      JSON.stringify(servicesWithImagesAndLocation),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    // Hiba esetén válasz
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
