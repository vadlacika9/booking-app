import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import bcrypt from 'bcrypt';

const db = new PrismaClient();

export async function POST(request){

  const body = await request.json();
  const {newPassword, token} = body;
  console.log(newPassword, token);

  try{

    const hashedPassword = await bcrypt.hash(newPassword,10);
    const changePassword = await db.users.findFirst({
      where:{
        resetPasswordToken: token,
        resetPasswordExpire : {gt: new Date()}
      }
     
    })

    if(!changePassword){
      return NextResponse.json({error : "Token not found"},{status: 500})
    }

    const updateUser = await db.users.update({
      where:{
        user_id: Number(changePassword.user_id)
      },
      data:{
        resetPasswordToken: null,
        resetPasswordExpire: null,
        password: hashedPassword
      }
    })
    return NextResponse.json({ message: "Password changed successfully" }, { status: 200 })
  }catch(error){
    return NextResponse.json({error: error.message}, {status: 500})
  }
}