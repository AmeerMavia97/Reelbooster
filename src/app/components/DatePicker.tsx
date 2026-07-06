/**
 * DateRangePicker component using `react-date-range`.
 *
 * Features:
 * - Shows a button with the selected date range.
 * - Opens a calendar dropdown when clicked.
 * - Normalizes `endDate` to the end of the day (23:59:59.999).
 * - Closes automatically on outside click.
 * - Supports initial start/end dates via props.
 *
 * @param {DateRangePickerProps} props
 */



"use client";
import { useState, useEffect, useRef } from "react";
import { DateRange, Range, RangeKeyDict } from "react-date-range";
import { format, subDays } from "date-fns";
import Image from "next/image";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

interface DateRangePickerProps {
  onChange?: (range: { startDate: Date; endDate: Date }) => void;
  initialStart?: Date;
  initialEnd?: Date;
}

export default function DateRangePicker({
  onChange,
  initialStart = subDays(new Date(), 6), // ✅ default: 7 days range
  initialEnd = new Date(),
}: DateRangePickerProps) {
  const [range, setRange] = useState<Range[]>([
    {
      startDate: initialStart,
      endDate: initialEnd,
      key: "selection",
    },
  ]);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const formattedRange = `${format(
    range[0].startDate ?? new Date(),
    "dd MMM"
  )} – ${format(range[0].endDate ?? new Date(), "dd MMM")}`;



  const handleChange = (item: RangeKeyDict) => {
    const selection = item.selection;

    const safeStart = selection.startDate ?? new Date();
    let safeEnd = selection.endDate ?? new Date();

    // ✅ Normalize endDate to end of the day (23:59:59.999)
    safeEnd = new Date(
      safeEnd.getFullYear(),
      safeEnd.getMonth(),
      safeEnd.getDate(),
      23,
      59,
      59,
      999
    );

    setRange([{ ...selection, startDate: safeStart, endDate: safeEnd }]);

    if (onChange) {
      onChange({ startDate: safeStart, endDate: safeEnd }); // ✅ Pass corrected dates
    }

    setOpen(false);
  };

  // ✅ Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside); // 👈 changed to "click"
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block" ref={ref}>
      {/* Button */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="border cursor-pointer border-gray rounded-xl px-3 py-0.5 text-gray text-xs flex items-center gap-2 bg-primary"
      >
        {formattedRange}
        <Image
          src="/gift/DateArrowDown.png"
          alt="down"
          width={10}
          height={10}
        />
      </button>

      {/* Calendar Dropdown */}
      {open && (
        <div className="absolute right-0 mt-2 z-50 shadow-lg rounded-xl bg-primary">
          <DateRange
            ranges={range}
            onChange={handleChange}
            maxDate={new Date()}
            rangeColors={["#1A9D77"]}
            direction="horizontal"
          />
        </div>
      )}
    </div>
  );
}
