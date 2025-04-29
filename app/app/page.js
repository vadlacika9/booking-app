import HeroSection from "../components/HeroSection";
import RecommendedSection from "../components/RecomendedSection";
import Slidein from "@/components/Slide-in";
import Footer from "@/components/Footer";
import { getServerSession } from "next-auth";
import { authOptions } from "../app/api/auth/[...nextauth]/route"; // Az authOptions a fájlból



export default async function App() {

  const session = await getServerSession(authOptions);

  console.log("session ",session)
  const res = await fetch("http://localhost:3000/api/services", {
    cache: "no-store",
  });

  /*if (!res.ok) {
    throw new Error("Hiba történt a szolgáltatások lekérésekor.");
  }*/

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
