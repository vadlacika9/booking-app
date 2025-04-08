import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route"

export async function POST(request) {
  const db = new PrismaClient();
  const body = await request.json();
  const {imageUrl} = body;
  const session = await getServerSession(authOptions);
  const userId = session.user.id
  console.log(imageUrl)

  try{

    const update = await db.users.update({
      where : {
        user_id: userId
      },
      data:{
        profile_pic: imageUrl
      }
    })
    console.log("updated pic", update)

    
    return new Response(
      JSON.stringify({ message: "Profile pic updated successfully!" }),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  }catch(error){
    console.error(error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }finally{
    await db.$disconnect();
  }



}