// components/SearchInput.tsx
import Image from "next/image";
import React, { useState, useEffect } from "react";

interface SearchInputProps {
  placeholder?: string;
  onSearch: (text: string) => void;
}

export default function SearchInput({
  placeholder = "Search...",
  onSearch,
}: SearchInputProps) {
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
  onSearch(searchText); // call directly, no debounce
}, [searchText]);


  return (
    <div className="relative pr-6">
      <div className="absolute left-2 top-1/2 transform -translate-y-1/2 p-2 rounded-full flex items-center justify-center">
        <Image
          src="/SidebarIcons/search.png"
          alt="Search"
          height={16}
          width={16}
        />
      </div>
      <input
        type="text"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        className="border border-main-green/[0.36] bg-main-green/[0.04] text-xs rounded-xl w-full py-2.5 pl-9.5 placeholder:text-gray placeholder:text-[12px] focus:outline-none"
        placeholder={placeholder}
        autoComplete="off"
        autoCorrect="off"
        spellCheck="false"
      />
    </div>
  );
}

