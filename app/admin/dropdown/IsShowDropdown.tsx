import { useState } from "react";
import { ChevronDown } from "lucide-react";

const isShowOptions = [
  { value: true, label: "노출" },
  { value: false, label: "숨김" },
];

interface Props {
  value: boolean;
  onChange: (value: boolean) => void;
}

export default function IsShowDropdown({ value, onChange }: Props) {
  const [open, setOpen] = useState(false);

  const selectedLabel =
    isShowOptions.find((opt) => opt.value === value)?.label || "";

  return (
    <div className="relative w-full">
      {/* 드롭다운 버튼 */}
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="w-full border rounded-md px-3 py-2 text-sm text-left flex justify-between items-center cursor-pointer bg-white"
      >
        {selectedLabel}
        <ChevronDown className="ml-2 w-4 h-4" />
      </button>

      {/* 옵션 목록 */}
      {open && (
        <ul className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-40 overflow-auto">
          {isShowOptions.map((opt) => (
            <li
              key={String(opt.value)}
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
              className={`px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 ${
                value === opt.value ? "bg-gray-200 font-semibold" : ""
              }`}
            >
              {opt.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
