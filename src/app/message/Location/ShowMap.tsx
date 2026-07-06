// import GoogleMapReact from "google-map-react";
// import { useAppSelector } from "@/app/utils/hooks";
// import Image from "next/image";

// interface MarkerProps {
//   lat: number;
//   lng: number;
// }

// interface MarkerProps {
//   lat: number;
//   lng: number;
// }

// const Marker: React.FC<MarkerProps> = () => (
//   <div className="relative">
//     <Image
//       src="/chat/filled_location.png"
//       width={100}
//       height={100}
//       alt="Marker"
//       className="h-10 w-10 object-contain"
//     />
//   </div>
// );



// const Marker = (MarkerProps) => (
//   <div className="relative">
//     <Image
//       src="/chat/filled_location.png"
//       width={100}
//       height={100}
//       alt="Marker"
//       className="h-10 w-10 object-contain"
//     />
//   </div>
// );

// export default function ShowMap() {
//   const sendMessageData = useAppSelector((state) => state.SendMessageData);

//   const lat = Number(sendMessageData.latitude); // fallback to Delhi
//   const lng = Number(sendMessageData.longitude);

//   return (
//     <div className="h-96 w-full ">
//       <GoogleMapReact
//         bootstrapURLKeys={{
//           key: process.env.NEXT_PUBLIC_GOOGLE_MAP_KEY || "",
//         }}
//         defaultCenter={{ lat, lng }}
//         center={{ lat, lng }}
//         defaultZoom={13}
//         options={{ fullscreenControl: false }}
//         draggable={false}
//       >
//         <Marker lat={lat} lng={lng} />
//       </GoogleMapReact>
//     </div>
//   );
// }
import GoogleMapReact from "google-map-react";
import { useAppSelector } from "@/app/utils/hooks";
import Image from "next/image";

interface MarkerProps {
  lat: number;
  lng: number;
}

const Marker: React.FC<MarkerProps> = () => (
  <div className="relative">
    <Image
      src="/chat/filled_location.png"
      width={100}
      height={100}
      alt="Marker"
      className="h-10 w-10 object-contain"
    />
  </div>
);

export default function ShowMap() {
  const sendMessageData = useAppSelector((state) => state.SendMessageData);

  const lat = Number(sendMessageData.latitude) || 28.6139; // fallback to Delhi
  const lng = Number(sendMessageData.longitude) || 77.209;

  return (
    <div className="h-96 w-full ">
      <GoogleMapReact
        bootstrapURLKeys={{
          key: process.env.NEXT_PUBLIC_GOOGLE_MAP_KEY || "",
        }}
        defaultCenter={{ lat, lng }}
        center={{ lat, lng }}
        defaultZoom={13}
        options={{ fullscreenControl: false }}
        draggable={false}
      >
        <Marker lat={lat} lng={lng} />
      </GoogleMapReact>
    </div>
  );
}
