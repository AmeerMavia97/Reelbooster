"use client";

import { useLanguage } from "@/app/i18n/LanguageProvider";
import {
  Locale,
  localeLabels,
  localeNativeLabels,
} from "@/app/i18n/translations";

const locales: Locale[] = ["tr", "en"];

export default function LanguageSwitcher() {
  const { locale, setLocale } = useLanguage();

  return (
    <div
      className="flex items-center rounded-full border border-main-green/50 bg-white text-xs font-medium overflow-hidden"
      aria-label="Language"
      data-i18n-skip="true"
    >
      {locales.map((item) => (
        <button
          key={item}
          type="button"
          aria-label={localeLabels[item]}
          title={localeLabels[item]}
          onClick={() => setLocale(item)}
          className={`px-3 py-1.5 transition-colors ${
            locale === item
              ? "bg-main-green text-white"
              : "text-main-green hover:bg-main-green/10"
          }`}
        >
          {localeNativeLabels[item]}
        </button>
      ))}
    </div>
  );
}
