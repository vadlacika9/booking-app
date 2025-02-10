import ImageCarousel from "../../components/ImageCarousel";

export default function Home() {
  const images = [
    "https://ceouekx9cbptssme.public.blob.vercel-storage.com/Screenshot%202024-05-30%20220520-YWvxMDClpxCdN30t05XdigDF1dMp0O.png",
    "https://ceouekx9cbptssme.public.blob.vercel-storage.com/Screenshot%202024-02-04%20144520-FB6A8u4IVY2Dc9LReBnsBwDbLCkYpV.png"
  ];

  return (
    <div>
      <h1 style={{ textAlign: "center" }}>Next.js Image Carousel</h1>
      <ImageCarousel images={images} />
    </div>
  );
}