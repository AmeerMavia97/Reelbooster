"use client";
import React, { useEffect, useRef } from "react";

interface LocationSearchProps {
  value: string;
  onChange: (location: string) => void;
  placeholder?: string;
}

export default function LocationSearch({ value, onChange, placeholder }: LocationSearchProps) {
  const locationInputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  const initAutocomplete = () => {
    if (locationInputRef.current && !autocompleteRef.current) {
      autocompleteRef.current = new window.google.maps.places.Autocomplete(locationInputRef.current, {
        types: ["geocode"],
        fields: ["formatted_address", "geometry"], // ✅ restrict fields for faster load
      });

      autocompleteRef.current.addListener("place_changed", () => {
        const place = autocompleteRef.current?.getPlace();
        if (place?.formatted_address) {
          onChange(place.formatted_address); // ✅ send location string back to parent
        }
      });
    }
  };

  useEffect(() => {
    if (window.google && window.google.maps && window.google.maps.places) {
      initAutocomplete();
      return;
    }

    const scriptId = "google-maps-script";
    if (document.getElementById(scriptId)) {
      return; // already added
    }

    const script = document.createElement("script");
    script.id = scriptId;
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyAMZ4GbRFYSevy7tMaiH5s0JmMBBXc0qBA&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => initAutocomplete();
    document.body.appendChild(script);
  }, []);

  return (
    <input
      ref={locationInputRef}
      type="text"
      className="w-full pl-13 border border-border-color text-xs p-4 rounded-md focus:outline-none focus:ring-1 focus:ring-main-green"
      placeholder={placeholder || "Search location..."}
      value={value}
      onChange={(e) => onChange(e.target.value)} // controlled input for typing
    />
  );
}
