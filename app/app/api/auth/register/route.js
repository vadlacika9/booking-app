
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';

export async function POST(req){
  const body = await req.json();
  
  const {firstName, lastName, username, password, email, phoneNumber} = body;
  console.log(firstName);
  if(!firstName || !lastName || !username || !password || !email || !phoneNumber){
    return new Response(
      JSON.stringify({ error: 'All the fields need to be filled !' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
    )
  }
  const db = new PrismaClient();
  try{
    const existingUser = await db.users.findFirst({
      where: {
        username: username,
        email: email
      }
    })

    if(existingUser){
      return new Response(
        JSON.stringify({ error: 'This username is existing !' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const hashedPassword = await bcrypt.hash(password,10);
    const user = await db.users.create({
      data:{
        first_name: firstName,
        last_name: lastName,
        username:username,
        email: email,
        phone_number: phoneNumber,
        password: hashedPassword,
        role:'user'

      }
    })

    return new Response(
      JSON.stringify({ error: 'Successfull registration!' }),
        { status: 201, headers: { 'Content-Type': 'application/json' } }
    )

  }catch(error){
    return new Response(
      JSON.stringify({ error: error.message }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
