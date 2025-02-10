import { PrismaClient } from "@prisma/client";
import { getServerSession } from 'next-auth/next';
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET(){
  const session = await getServerSession(authOptions);
  console.log(session);
  const db = new PrismaClient();
  const id = session.user.id;
  console.log(id);
  try{

  
  const myServices = await db.services.findMany({
    where: {
      user_id: parseInt(id)
    }
  })

  

 /* const servicesWithImages = await Promise.all(myServices.map(async (service) => {
    const serviceImages = await db.images.findMany({
      where: {
        service_id: service.service_id,
        type: 'service'
      }
    });
    
    return {
      ...service,
      images: serviceImages.length ? serviceImages.map(img => img.path) : ['https://ceouekx9cbptssme.public.blob.vercel-storage.com/default-oCOnxEAVLnQCAxCIb9R87WUp5jLrTP.png']
    };
  }));
  console.log('servicesWithImages:', servicesWithImages);*/

  const servicesWithImagesAndLocation = await Promise.all(myServices.map(async (service) => {
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

  return new Response(
    JSON.stringify(servicesWithImagesAndLocation),
    {status: 200, headers: {'Content-Type' : 'application/json'}}
  );
}catch(error){
  JSON.stringify({ error: error.message }),
    { status: 500, headers: { 'Content-Type': 'application/json' } }
}
}