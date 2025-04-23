import HeroSection from "../components/HeroSection";
import RecommendedSection from "../components/RecomendedSection";
import Slidein from "@/components/Slide-in";
import Footer from "@/components/Footer";



export default async function App() {

  const res = await fetch("http://localhost:3000/api/services", {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Hiba történt a szolgáltatások lekérésekor.");
  }

  const services = await res.json();

  return (
    <div className="overflow-x-hidden">
      <HeroSection />
      <RecommendedSection services={services}/>
      <Slidein/>
      <Footer/>
    </div>
  );
}
