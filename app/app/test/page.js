export default function Test() {
  return (
    
        <div className="relative w-full h-screen overflow-hidden">
          {/* Háttérvideó */}
          <video 
            autoPlay 
            loop 
            muted 
            className="absolute top-0 left-0 w-full h-full object-cover"
          >
            <source src="images/3971844-hd_1920_1080_25fps.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
    
          {/* Tartalom a videó fölött */}
          <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center px-6">
            <h1 className="text-5xl font-bold">Welcome to Our Website</h1>
            <p className="text-lg mt-4">Discover amazing experiences with us</p>
            <button className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
              Get Started
            </button>
          </div>
    
          {/* Sötét Overlay a jobb olvashatóságért */}
          <div className="absolute top-0 left-0 w-full h-full bg-black/40"></div>
        </div>
      );
    }
    
