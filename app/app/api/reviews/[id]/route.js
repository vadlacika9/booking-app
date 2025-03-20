import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

export async function GET(request, {params}){
  const {id} = await params;
  console.log(id)
  const serviceId = Number(id);

  if (isNaN(serviceId)) {
    return new Response(
      JSON.stringify({ error: "Invalid service ID" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }


  try{
    const reviews = await db.feedback.findMany({
      where: {
        service_id: Number(serviceId)
      },
      include:{
        users:true
      }
    })

    return new Response(
      JSON.stringify(reviews),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );

  }catch(error){
    console.error("Error fetching service:", error);
    return new Response(
      JSON.stringify({ error: "Internal Server Error" }),
      { status: 500 }
    );
  }finally{
    await db.$disconnect();
  }
}

export async function POST(request, { params }) {
  try {
   
    const body = await request.json();
    console.log(body);

   
    const { userId, comment, rating } = body; 
    
    const { id } = await params;
    const serviceId = Number(id); 

 
    if (!userId || !comment || !rating || !serviceId) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

 
    const addFeedback = await db.feedback.create({
      data: {
        user_id: userId,
        service_id: serviceId,
        comment: comment,
        rating: rating,
      },
    });

 
    return new Response(
      JSON.stringify(addFeedback),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error adding feedback:", error);
    return new Response(
      JSON.stringify({ error: "Internal Server Error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  } finally {
    await db.$disconnect(); 
  }
}

export async function DELETE(request){
  try{
    const feedback_id = await request.json();
    
    const deleteRev = await db.feedback.delete({
      where: {
        feedback_id: Number(feedback_id)
      }
    })
    return new Response(
      JSON.stringify({ message: `Feedback deleted successfully, id: ${feedback_id}` }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );

  }catch(error){
    console.log(error)
    return new Response(
      JSON.stringify({ error: `Error deleting feedback: ${error.message}` }), 
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }finally{
    await db.$disconnect();
  }
}

export async function PUT(request){
  try{
      const body = await request.json();
      const {comment, feedback_id} = body;

      const updateRev = await db.feedback.update({
        where: {
          feedback_id: feedback_id
        },
        data:{
          comment: comment
        }
      })

    return new Response(
      JSON.stringify({ message: `Feedback updated successfully, id: ${feedback_id}` }), 
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  }catch(error){
    console.log(error)
    return new Response(
      JSON.stringify({ error: `Error updating feedback: ${error.message}` }), 
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }finally{
    await db.$disconnect()
  }
}
