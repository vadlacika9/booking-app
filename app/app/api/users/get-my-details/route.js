import { PrismaClient } from "@prisma/client";
import { getServerSession } from 'next-auth/next';
import { authOptions } from "../../auth/[...nextauth]/route";

const db = new PrismaClient();

export  async function GET(){
    const session = await getServerSession(authOptions);
    const userId = session.user.id;


  try{

    const data  = await db.users.findFirst({
      where:{
        user_id: Number(userId)
    }})
  
    if (!data) {
      return new Response(
        JSON.stringify({ error: "No user found with this id." }),
        { status: 404 }
      );
    }
    
    return new Response(
      JSON.stringify(data),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );

  }catch(error){
    console.log(error);
    return new Response(
      JSON.stringify({ error: "Internal Server Error" }),
      { status: 500 }
    );
  }finally{
    await db.$disconnect();
  }
}

