import { list } from "@vercel/blob";
import DeleteButton from "./delete-button";

export default async function AllFiles(){
  const {blobs} = await list();

  return (
    <div className="bg-black">
    {blobs.map((blob) => (
      <div className="text-white" key={blob.url}>
        
        {blob.pathname} - <DeleteButton url={blob.url}/>
        </div>
    ))}
  </div>
  )
  
}