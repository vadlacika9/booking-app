import ImageCarousel from "@/components/ImageCarousel";


const images = ["/images/kep1.jpg", "/images/kep2.jpg"];
const Carousel = () => {
  return (
    <ImageCarousel images={images}/>
  )
}

export default  Carousel;