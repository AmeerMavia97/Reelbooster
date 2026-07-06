"use client";

import { useParams } from "next/navigation";
import ProfileHeader from "../ProfileComponents/profileHeader";
import ProfileOptions from "../ProfileComponents/profileOptions"

export default function OtherUserProfile() {
  const { id } = useParams();

  return (
    <div className="pt-[60px] sm:max-w-6xl sm:px-6 2xl:px-0 mx-auto">
      <ProfileHeader userId={id as string} isMyProfile={false} />
      <ProfileOptions />
    </div>
  );
}
