import { list } from "@vercel/blob";
import DeleteButton from "./delete-button";

export default async function AllFiles(){
  const {blobs} = await list();
  console.log({blobs});

  return (
    <div className="bg-black">
      <p className="text-white">Hello</p>
    {blobs.map((blob) => (
      <div className="text-white" key={blob.url}>
        
        {blob.pathname} - <DeleteButton url={blob.url}/>
        </div>
    ))}
  </div>
  )
  
}