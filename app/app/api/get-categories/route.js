import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

export async function GET(){
try{
  const categories = await db.category.findMany();
  
  return new Response(
    JSON.stringify(categories),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
}catch(error){
  console.error("Error fetching categories:", error);
  return new Response(
    JSON.stringify({ error: "Internal Server Error" }),
    { status: 500 }
  );
}finally{
  await db.$disconnect();
}
}