"use client";

import { useEffect, useState } from "react";
import { ProjectConfigRes } from "@/app/types/ResTypes";
import DOMPurify from "dompurify";
import Cookies from "js-cookie";

export default function TermsConditionsPage() {
  const [privacyHtml, setPrivacyHtml] = useState<string>("");
  const token = Cookies.get("Reelboost_auth_token")
  useEffect(() => {
    if (!token) return;
    const fetchConfig = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/project_conf`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const data: ProjectConfigRes = await res.json();

        if (data?.status && data.data?.privacy_policy) {
          setPrivacyHtml(data.data.terms_and_conditions);
        }
      } catch (error) {
      }
    };

    fetchConfig();
  }, [token]);

  return (
    <>
      <div className="flex gap-3 place-items-center sm:pt-6">
        
        <h1 className="text-lg font-bold text-dark sm:block hidden">Terms & Conditions</h1>
      </div>
      <div className="max-w-4xl mx-auto px-4">
        {privacyHtml ? (
          <div
            className="prose prose-sm sm:prose lg:prose-lg max-w-none text-dark-gray"
         
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(privacyHtml || ""),
            }}
          />
        ) : (
          <p className="text-gray">Loading...</p>
        )}
      </div>
    </>
  );
}
