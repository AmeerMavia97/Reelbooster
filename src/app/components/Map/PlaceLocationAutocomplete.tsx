"use client";

import React, { useEffect, useRef } from "react";

type Props = {
  placeholder?: string;
  onPlaceSelect: (location: { name: string; lat: number; lng: number }) => void;
  defaultValue?: string;
};

export default function PlaceLocationAutocomplete({
  placeholder = "Search Location",
  onPlaceSelect,
  defaultValue = "",
}: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const loadScript = () => {
      if (document.getElementById("google-maps-script")) {
        initializeAutocomplete();
        return;
      }

      const script = document.createElement("script");
      script.id = "google-maps-script";
      script.src =
        "https://maps.googleapis.com/maps/api/js?key=AIzaSyAMZ4GbRFYSevy7tMaiH5s0JmMBBXc0qBA&libraries=places";
      script.async = true;
      script.defer = true;
      script.onload = initializeAutocomplete;
      document.head.appendChild(script);
    };

    const initializeAutocomplete = () => {
      if (inputRef.current && window.google) {
        const autocomplete = new google.maps.places.Autocomplete(
          inputRef.current,
          {
            types: ["geocode"],
            componentRestrictions: { country: "in" },
          }
        );

        autocomplete.addListener("place_changed", () => {
          const place = autocomplete.getPlace();
          if (
            place.geometry &&
            typeof place.geometry.location?.lat === "function" &&
            typeof place.geometry.location?.lng === "function"
          ) {
            const lat = place.geometry.location.lat();
            const lng = place.geometry.location.lng();
            if (typeof lat === "number" && typeof lng === "number") {
              const location = {
                name: place.formatted_address || "",
                lat,
                lng,
              };
              onPlaceSelect(location);
            }
          }
        });
      }
    };

    loadScript();
  }, []);

  return (
    <input
      type="text"
      placeholder={placeholder}
      defaultValue={defaultValue}
      ref={inputRef}
      className="border border-gray rounded-lg w-full py-2 my-1 pl-11 text-xs bg-primary focus:outline-none focus:ring-1 focus:ring-main-green"
    />
  );
}
