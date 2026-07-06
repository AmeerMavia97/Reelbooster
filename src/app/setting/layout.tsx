"use client";

export default function SettingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
  
<>
      {/* Page Content, centered in remaining space */}
      <div className="w-full flex justify-center">
        <div className="w-full sm:max-w-3xl mt-20 sm:p-6 mb-6 rounded-lg sm:min-h-[820px]" style={{ boxShadow: "0px 1.22px 14.55px 0px #0000000F" }}>
          {children}
        </div>
      </div>
      </>
  );
}
