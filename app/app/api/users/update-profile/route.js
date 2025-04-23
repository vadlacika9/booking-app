import { PrismaClient } from "@prisma/client";
import { getServerSession } from 'next-auth/next';
import { authOptions } from "../../auth/[...nextauth]/route";

const db = new PrismaClient();

export async function PUT(request){

  const session = await getServerSession(authOptions);
  const userId = session.user.id;
  const body = await request.json();
  const {first_name, last_name} = body;

  try{

    const updateUser = await db.users.update({
      where:{
        user_id: userId
      },
      data:{first_name:first_name, last_name: last_name}
    })

    return new Response(
      JSON.stringify({ message: "User updated successfully", updateUser }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );

  }catch(error){
    console.log(error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }finally{
    await db.$disconnect();
  }
}