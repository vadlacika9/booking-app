import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const db = new PrismaClient();

export async function POST(request){
  try{
    const reqBody = await request.json();
    const {token} = reqBody;

    const user = await db.users.findFirst({
      where: {verifiyToken : token,
        verifiyTokenExpire: {gt: new Date()}
        
      }
    })

    if(!user){
      return NextResponse.json({error : "User not found"},{status: 500})
    }

    console.log(user.user_id)

    await db.users.update({
      where: { user_id: user.user_id }, 
      data: {
          isVerified: "true",
          verifiyToken: null,
          verifiyTokenExpire: null
      }
  });

  return NextResponse.json({ message: "User verified successfully" }, { status: 200 },
    {success: true}
  );
    
  }catch(error){
    return NextResponse.json({error: error.message}, {status: 500})
  }
} 