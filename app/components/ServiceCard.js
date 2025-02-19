import Image from "next/image";
import Link from "next/link";
export default function ServiceCard({ id, name, desc, price, image, location }) {
  return (
    <Link href={`/services/${id}`}>
    <div className="bg-white rounded-lg  p-4 hover:cursor-pointer">
      <Image src={image} alt={name} width={200} height={200}className="rounded-md mb-4 w-72 h-44 object-cover" />
      <h3 className="text-lg font-semibold">{name}</h3>
      <p className="text-sm text-gray-500">{desc}</p>
      <p className="text-sm text-gray-500">{location.city}, {location.address}</p>
    </div>
    </Link>
  );
}