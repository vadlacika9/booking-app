import { PrismaClient } from "@prisma/client";
import { NextResponse, NextRequest } from "next/server";
import { sendEmail } from "@/utils/mailer";

const db = new PrismaClient();

export async function POST(request){
const body = await request.json();
const {email} = body;
console.log(email)
  try{

const isThereEmail = await db.users.findFirst({
  where:{
    email: email
  }
})

    if(!isThereEmail){
        return NextResponse.json({error : "There are no such email"},{status: 500})
    }

    const emailres = await sendEmail({email, emailType: "RESET",
      userId: isThereEmail.user_id
    })

    console.log(emailres)

  
  return NextResponse.json({ message: "Valid email and token created" }, { status: 200 })
}catch(error){
    return NextResponse.json({error: error.message}, {status: 500})
}
}