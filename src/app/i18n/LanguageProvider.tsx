"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Cookies from "js-cookie";
import {
  DEFAULT_LOCALE,
  LOCALE_STORAGE_KEY,
  Locale,
  translateText,
} from "./translations";

type LanguageContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (value: string) => string;
};

const LanguageContext = createContext<LanguageContextValue | undefined>(
  undefined
);

const TRANSLATABLE_ATTRIBUTES = [
  "placeholder",
  "title",
  "aria-label",
  "alt",
] as const;

const shouldSkipElement = (element: Element | null) => {
  if (!element) return true;
  return Boolean(
    element.closest(
      "script, style, noscript, svg, canvas, [data-i18n-skip='true']"
    )
  );
};

const isTranslatedVariant = (original: string, currentValue: string) =>
  currentValue === translateText(original, "tr");

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);
  const textOriginals = useRef<WeakMap<Text, string>>(new WeakMap());
  const attrOriginals = useRef<WeakMap<Element, Partial<Record<string, string>>>>(
    new WeakMap()
  );

  useEffect(() => {
    const saved =
      typeof window !== "undefined"
        ? window.localStorage.getItem(LOCALE_STORAGE_KEY)
        : null;

    if (saved === "tr" || saved === "en") {
      setLocaleState(saved);
    }
  }, []);

  const setLocale = useCallback((nextLocale: Locale) => {
    setLocaleState(nextLocale);
    window.localStorage.setItem(LOCALE_STORAGE_KEY, nextLocale);
    Cookies.set(LOCALE_STORAGE_KEY, nextLocale, { expires: 365 });
  }, []);

  const applyToTextNode = useCallback(
    (node: Text) => {
      const parent = node.parentElement;
      if (shouldSkipElement(parent)) return;

      const currentValue = node.nodeValue ?? "";
      if (!currentValue.trim()) return;

      let original = textOriginals.current.get(node);
      if (!original) {
        original = currentValue;
        textOriginals.current.set(node, original);
      } else {
        const wasChangedByReact =
          currentValue !== original &&
          !isTranslatedVariant(original, currentValue);

        if (wasChangedByReact) {
          original = currentValue;
          textOriginals.current.set(node, original);
        }
      }

      const nextValue =
        locale === "en" ? original : translateText(original, locale);
      if (node.nodeValue !== nextValue) {
        node.nodeValue = nextValue;
      }
    },
    [locale]
  );

  const applyToElementAttributes = useCallback(
    (element: Element) => {
      if (shouldSkipElement(element)) return;

      let originals = attrOriginals.current.get(element);

      TRANSLATABLE_ATTRIBUTES.forEach((attribute) => {
        const currentValue = element.getAttribute(attribute);
        if (!currentValue?.trim()) return;

        if (!originals) {
          originals = {};
          attrOriginals.current.set(element, originals);
        }

        if (!originals[attribute]) {
          originals[attribute] = currentValue;
        } else {
          const wasChangedByReact =
            currentValue !== originals[attribute] &&
            !isTranslatedVariant(originals[attribute], currentValue);

          if (wasChangedByReact) {
            originals[attribute] = currentValue;
          }
        }

        const original = originals[attribute] ?? currentValue;
        const nextValue =
          locale === "en" ? original : translateText(original, locale);

        if (currentValue !== nextValue) {
          element.setAttribute(attribute, nextValue);
        }
      });
    },
    [locale]
  );

  const applyTranslations = useCallback(
    (root: ParentNode = document.body) => {
      if (!root) return;

      const walker = document.createTreeWalker(
        root,
        NodeFilter.SHOW_TEXT,
        {
          acceptNode: (node) =>
            shouldSkipElement(node.parentElement)
              ? NodeFilter.FILTER_REJECT
              : NodeFilter.FILTER_ACCEPT,
        }
      );

      let textNode = walker.nextNode();
      while (textNode) {
        applyToTextNode(textNode as Text);
        textNode = walker.nextNode();
      }

      if (root instanceof Element) {
        applyToElementAttributes(root);
      }

      root.querySelectorAll?.("*").forEach(applyToElementAttributes);
    },
    [applyToElementAttributes, applyToTextNode]
  );

  useEffect(() => {
    document.documentElement.lang = locale;
    applyTranslations();

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.TEXT_NODE) {
            applyToTextNode(node as Text);
          } else if (node.nodeType === Node.ELEMENT_NODE) {
            applyTranslations(node as Element);
          }
        });

        if (mutation.type === "characterData") {
          applyToTextNode(mutation.target as Text);
        }

        if (mutation.type === "attributes") {
          applyToElementAttributes(mutation.target as Element);
        }
      });
    });

    observer.observe(document.body, {
      attributes: true,
      attributeFilter: [...TRANSLATABLE_ATTRIBUTES],
      characterData: true,
      childList: true,
      subtree: true,
    });

    return () => observer.disconnect();
  }, [
    applyToElementAttributes,
    applyToTextNode,
    applyTranslations,
    locale,
  ]);

  const value = useMemo(
    () => ({
      locale,
      setLocale,
      t: (text: string) => translateText(text, locale),
    }),
    [locale, setLocale]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used inside LanguageProvider");
  }
  return context;
}
