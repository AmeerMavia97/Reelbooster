"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import Cookies from "js-cookie";
import DialogContainer from "./components/DialogContainer";
import Header from "./components/Header/Header";
import Sidebar from "./components/SidebarComponents/Sidebar";
import SettingSidebar from "./setting/SettingSidebar";
import { Toaster } from "react-hot-toast";
import { ToastContainer } from "react-toastify";

export default function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const isSettingsPage = pathname.startsWith("/setting");
  const isNotFound = pathname === "/not-found";


  console.log("pathnamedynamic", pathname)


  const isViewStreaming = /^\/live\/[^/]+$/.test(pathname);

  const isHost = /^\/host$/.test(pathname);

  // Public share-landing page for a single reel (used by the native share sheet link).
  // Must stay reachable without a login so recipients of a shared link can view it.
  const isReelShare = /^\/reel\/[^/]+$/.test(pathname);

console.log("isHost:", isHost);




  console.log("isViewStreaming", isViewStreaming)

  useEffect(() => {
    const token = Cookies.get("Reelboost_auth_token");
    const publicRoutes = ["/", "/not-found"];

    if (!token && !publicRoutes.includes(pathname) && !isReelShare) {
      router.replace("/");
    }
  }, [pathname, router, isReelShare]);

  return (
    <>
      {/* ✅ MUST ALWAYS BE MOUNTED */}
      <DialogContainer />

      {!isNotFound && !isViewStreaming && !isHost && !isReelShare && <Header />}

      <div className="flex">
        {!isNotFound && !isViewStreaming && !isHost && !isReelShare && (
          <>
            <Sidebar onNavigate={() => { }} />

            {isSettingsPage && (
              <div className="lg:pl-[270px] hidden sm:block">
                <SettingSidebar onBack={() => history.back()} />
              </div>
            )}
          </>
        )}

        <main
          className={`flex-1 ${!isNotFound && !isSettingsPage && !isViewStreaming && !isHost && !isReelShare
            ? "lg:ml-[270px]"
            : ""
            }`}
        >
          {/* ✅ Let Next.js render pages */}
          {children}
        </main>
      </div>
      {/* Toasts */}
      <Toaster position="bottom-right" reverseOrder={false} />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme="dark"
        limit={3}
        toastStyle={{ background: "#1e293b", color: "#fff" }}
      />
    </>
  );
}
