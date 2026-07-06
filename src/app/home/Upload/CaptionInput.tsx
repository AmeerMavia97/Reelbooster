"use client";
import React, { useState, useRef } from "react";
import { useAppSelector, useAppDispatch } from "../../utils/hooks";
import { setCaption } from "@/app/store/Slice/MediaSlice";
import useApiPost from "@/app/hooks/postData";
import { HashtagRecord, HashtagSocialResponse } from "@/app/types/ResTypes";

export default function CaptionInput() {
  const caption = useAppSelector((state) => state.media.caption);
  const dispatch = useAppDispatch();
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [hashtags, setHashtags] = useState<HashtagRecord[]>([]);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const {postData} = useApiPost();

  // Fetch hashtags from API
  const fetchHashtags = async (query: string) => {
    if (!query) return;
    try {
      const res:HashtagSocialResponse = await postData("/hashtag/get-hashtags", {
        hashtag_name: query 
      });
      setHashtags(res.data?.Records || []);
    } catch (err) {
      setHashtags([]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    dispatch(setCaption(val));

    // Detect last #word
    const hashMatch = val.match(/#(\w*)$/);
    if (hashMatch) {
      setSearchTerm(hashMatch[1]);
      setShowDropdown(true);
      fetchHashtags(hashMatch[1]); // fetch from API
    } else {
      setShowDropdown(false);
      setHashtags([]);
    }
  };

  const handleSelect = (tag: string) => {
    const newText = caption.replace(/#(\w*)$/, `#${tag} `);
    dispatch(setCaption(newText));
    setShowDropdown(false);
    inputRef.current?.focus();
  };

  return (
    <div className="relative">
      <label className="text-sm text-dark">Write a Caption</label>
      <textarea
        ref={inputRef}
        rows={5}
        className="w-full border border-border-color text-xs rounded-md p-2 bg-primary focus:outline-none focus:ring-1 focus:ring-main-green"
        placeholder="Write a Caption"
        value={caption}
        onChange={handleChange}
      />

      {showDropdown && hashtags.length > 0 && (
        <ul className="absolute bg-primary border mt-1 rounded-md max-h-48 overflow-auto z-50 w-full">
          {hashtags.map((tag) => (
            <li
              key={tag.hashtag_id}
              className="px-2 py-1 text-xs cursor-pointer hover:bg-green-100 text-main-green"
              onClick={() => handleSelect(tag.hashtag_name)}
            >
              #{tag.hashtag_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
