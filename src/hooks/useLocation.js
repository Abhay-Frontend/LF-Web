import { useState } from "react";

export const useLocation = () => {
  const [coords, setCoords] = useState({ latitude: null, longitude: null });
  const [error, setError] = useState(null);
  const [token, setToken] = useState(null);

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation not supported by your browser");
      sendFailedLocationToAPI();
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setCoords({ latitude, longitude });

        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/location/resolve`, {
            method: "POST",
            headers: { "Content-Type": "application/json", },//NO TOKEN YET
            body: JSON.stringify({ lat: latitude, lng: longitude }),
          });
          const data = await res.json();
          setToken(data.locationToken || null);
        } catch (err) {
          console.error("API failed:", err);
          setError("Failed to send location to server.");
        }
      },
      (err) => {
        if (err.code === 1) setError("Permission denied. Please allow location access.");
        else setError(err.message || "Unable to retrieve your location");
        sendFailedLocationToAPI();
      }
    );
  };

  const sendFailedLocationToAPI = async () => {
    try {
      await fetch("/api/location/resolve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lat: null, lng: null, failed: true }),
      });
    } catch (err) {
      console.error("Failed API call for location:", err);
    }
  };

  return { coords, error, token, requestLocation }; // <-- expose requestLocation
};

