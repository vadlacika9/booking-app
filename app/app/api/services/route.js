/*import { PrismaClient } from "@prisma/client";

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
*/

import { PrismaClient } from "@prisma/client";


const prisma = new PrismaClient();

export async function GET() {
  try {
    // Az összes szolgáltatás lekérése
    const allServices = await prisma.services.findMany({
      include: {
        duration: true,
        images: true,
        services_location: {
          include: {
            location: true
          }
        }
      }
    });

    // Ha nincs egyetlen szolgáltatás sem
    if (!allServices.length) {
      return new Response(
        JSON.stringify({ error: "No services found" }),
        { status: 404 } // 404 Not Found
      );
    }

    // Minden szolgáltatás feldolgozása
    const formattedServices = allServices.map(service => ({
      service_id: service.service_id,
      user_id: service.user_id,
      service_name: service.name,
      service_description: service.description,
      service_price: service.price,
      duration_id: service.duration[0]?.duration_id || null,
      duration_start_time: service.duration[0]?.start_time || null,
      duration_end_time: service.duration[0]?.end_time || null,
      images: service.images.length
        ? service.images.map(img => img.path)
        : ['https://ceouekx9cbptssme.public.blob.vercel-storage.com/default-oCOnxEAVLnQCAxCIb9R87WUp5jLrTP.png'],
      location_id: service.services_location[0]?.location?.location_id || null,
      postal_code: service.services_location[0]?.location?.postal_code || null,
      county: service.services_location[0]?.location?.county || null,
      service_location: service.services_location[0]?.location?.city || null,
      service_address: service.services_location[0]?.location?.address || null,
      days_available: service.duration[0]?.service_days_available || []
    }));

    // Sikeres válasz
    return new Response(
      JSON.stringify(formattedServices),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error fetching services:", error);
    return new Response(
      JSON.stringify({ error: "Internal Server Error" }),
      { status: 500 } // 500 Internal Server Error
    );
  }
}
