'use client'

import { useEffect, useRef, useState } from "react";
import { Loader } from '@googlemaps/js-api-loader';

const MapsTest = () => {
  const mapRef = useRef(null);
  const [markerData, setMarkerData] = useState(null); // Állapot a marker adatainak tárolására
  const [marker, setMarker] = useState(null); // Marker tárolása

  useEffect(() => {
    const initMap = async () => {
      const loader = new Loader({
        apiKey: process.env.NEXT_PUBLIC_MAPS_API_KEY,
        version: "weekly"
      });

      // Load the Maps library
      loader.load().then(() => {
        // Check if geolocation is available
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition((position) => {
            const { latitude, longitude } = position.coords;

            const mapOptions = {
              center: { lat: latitude, lng: longitude }, // Set center to user's current location
              zoom: 15, // Set zoom level
            };

            // Initialize the map after loading the library
            const map = new google.maps.Map(mapRef.current, mapOptions);

            // Geocoder objektum létrehozása a címek lekéréséhez
            const geocoder = new google.maps.Geocoder();

            // Allow the user to place a marker by clicking on the map
            google.maps.event.addListener(map, 'click', (e) => {
              const position = e.latLng;

              // Ha létezik korábbi marker, eltávolítjuk
              if (marker) {
                marker.setMap(null);
              }

              // Új marker létrehozása a kattintott helyen
              const newMarker = new google.maps.Marker({
                position: position,
                map: map,
                title: "Custom Location", // You can change this
              });

              // Geocode a clicked position to get the address
              geocoder.geocode({ location: position }, (results, status) => {
                if (status === "OK" && results[0]) {
                  // Hely neve (pl. város, utca)
                  setMarkerData({
                    lat: position.lat(),
                    lng: position.lng(),
                    address: results[0].formatted_address // A hely neve
                  });
                } else {
                  alert("Unable to retrieve address.");
                }
              });

              // Marker tárolása az állapotban
              setMarker(newMarker);
            });
          }, (error) => {
            // Handle geolocation error
            console.error("Error fetching location:", error);
            alert("Unable to fetch your location.");
          });
        } else {
          // Handle case when geolocation is not available
          alert("Geolocation is not supported by this browser.");
        }
      });
    };

    initMap();
  }, [marker]); // Frissítjük a marker-t

  return (
    <div>
      <h1>Google Maps</h1>
      <div ref={mapRef} style={{ height: '500px', width: '100%' }}></div>

      {/* Display marker information if any */}
      {markerData && (
        <div>
          <h2>Marker Information</h2>
          <p><strong>Latitude:</strong> {markerData.lat}</p>
          <p><strong>Longitude:</strong> {markerData.lng}</p>
          <p><strong>Address:</strong> {markerData.address}</p>
        </div>
      )}
    </div>
  );
}

export default MapsTest;
