const getUserLocation = () => {
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log("Helyzet engedélyezve!");
        console.log("Szélesség:", position.coords.latitude);
        console.log("Hosszúság:", position.coords.longitude);
      },
      (error) => {
        console.error("Hiba a helymeghatározáskor:", error.message);
      }
    );
  } else {
    console.error("A böngésző nem támogatja a helymeghatározást.");
  }
};