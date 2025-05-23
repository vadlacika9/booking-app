
import { PrismaClient } from "@prisma/client";

export async function GET(request) {

  const db = new PrismaClient();

  try {
  
    const users = await db.users.findMany();

    return new Response(JSON.stringify(users), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }finally{
    await db.$disconnect();
  }
}