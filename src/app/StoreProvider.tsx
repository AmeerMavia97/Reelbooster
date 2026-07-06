// "use client";
// import { Provider } from "react-redux";
// import { store } from "./store/store";
// import { GoogleOAuthProvider } from "@react-oauth/google";

// export default function StoreProvider({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <GoogleOAuthProvider
//       clientId={`${process.env.NEXT_PUBLIC_GOOGLE_SIGNIN_ID}`}
//     >
//       <Provider store={store}>
//         {children}
//       </Provider>
//     </GoogleOAuthProvider>
//   );
// }


"use client";
import { Provider } from "react-redux";
import { store } from "./store/store";
import { GoogleOAuthProvider } from "@react-oauth/google";
import ListenAllEvents from "./socket/ListenAllEvents";
import QueryProvider from "./QueryProvider"; // import your QueryClientProvider wrapper

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {

  console.log(process.env.NEXT_PUBLIC_GOOGLE_SIGNIN_ID);
  return (
    <GoogleOAuthProvider clientId={'40811516201-q07cod35oafhoa76j331nrbuvppjs8a2.apps.googleusercontent.com'}>
      <Provider store={store}>
        <QueryProvider >
          <ListenAllEvents />
          {children}
        </QueryProvider>
      </Provider>
    </GoogleOAuthProvider>
  );
}
