import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

export async function DELETE(request){
  try{
    const body = await request.json();
    const {path} = body;

    console.log("path:", path)

    const deletePicture = await db.images.deleteMany({
      where:{
        path:path
      }
    })

    return new Response(
      JSON.stringify({ message: "Image deleted successfully!" }), 
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  }catch(error){
    return new Response(
      JSON.stringify({ error: `Error deleting image: ${error.message}` }), 
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }finally{
    await db.$disconnect();
  }
  
}