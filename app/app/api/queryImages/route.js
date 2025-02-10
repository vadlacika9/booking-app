import { PrismaClient } from "@prisma/client";


export default async function GET(){
  const db= new PrismaClient();
    
  try{

  }catch(error){
    console.log(error);
  }
}