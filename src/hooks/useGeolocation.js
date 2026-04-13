import { useState } from "react";
import { toast } from "sonner";

/**
 * Custom hook for geolocation operations
 */
export const useGeolocation = () => {
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsError, setGpsError] = useState("");

  const useCurrentLocation = (onLocationSuccess) => {
    setGpsError("");

    if (!navigator.geolocation) {
      setGpsError("GPS location is not supported by this browser.");
      return;
    }

    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = position.coords.latitude.toFixed(6);
        const longitude = position.coords.longitude.toFixed(6);

        onLocationSuccess({
          latitude,
          longitude,
          issue_location: `${latitude}, ${longitude}`,
        });

        setGpsLoading(false);
        toast.success("Current location added.");
      },
      (error) => {
        console.error("GPS error:", error);
        setGpsError("Unable to read your current location.");
        setGpsLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      },
    );
  };

  return {
    gpsLoading,
    gpsError,
    setGpsError,
    useCurrentLocation,
  };
};
