"use client";
import React, { useEffect, useState } from "react";
import { useGiftCategories } from "../store/api/getGiftCategories";
import { useAppDispatch, useAppSelector } from "../utils/hooks";
import { setSelectedCategory } from "../store/Slice/selectedGiftCategorySlice";
import { ClipLoader } from "react-spinners";

export default function GiftCategories() {
  const dispatch = useAppDispatch();
  const selectedCategoryId = useAppSelector(
    (state) => state.gift.selectedCategoryId
  );

  const [page] = useState(1);
  const { data, isLoading, isError } = useGiftCategories(page);

  // 👉 Auto-select the first category if none is selected
  useEffect(() => {
    if (
      data?.data?.Records?.length &&
      !selectedCategoryId // only if not already set
    ) {
      dispatch(setSelectedCategory(data.data.Records[0].gift_category_id));
    }
  }, [data, selectedCategoryId, dispatch]);

  if (isLoading)
    return (
      <div className="max-h-[550px]">
        <p>
          <ClipLoader color="#1A9D77" size={15} />
        </p>
      </div>
    );

  if (isError) return <p>Something went wrong!</p>;

  return (
    <div className="flex items-center justify-center gap-4 background-opacityGradient px-4 rounded-xl">
      {data?.data?.Records.map((category, index: number) => (
        <React.Fragment key={category.gift_category_id}>
          <button
            onClick={() =>
              dispatch(setSelectedCategory(category.gift_category_id))
            }
            className={`flex-1 text-sm relative font-medium py-2 cursor-pointer transition-colors duration-200
              ${
                selectedCategoryId === category.gift_category_id
                  ? "text-main-green"
                  : "text-gray-500 hover:text-main-green"
              }
            `}
          >
            {category.name}
            {selectedCategoryId === category.gift_category_id && (
              <span className="absolute left-1/2 -translate-x-1/2 bottom-0 sm:w-16 w-20 h-[2px] bg-main-green rounded-full" />
            )}
          </button>
          {index < data?.data?.Records.length - 1 && (
            <div className="w-px h-3 bg-main-green/[0.35]"></div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
