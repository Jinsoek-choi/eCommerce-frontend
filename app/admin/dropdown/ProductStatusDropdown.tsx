import { useState } from "react";
import { ChevronDown } from "lucide-react";

const productStatusOptions = [
  { value: 10, label: "정상" },
  { value: 20, label: "품절" },
  { value: 21, label: "재고확보중" },
  { value: 40, label: "판매중지" },
  { value: 90, label: "판매종료" },
];

interface Props {
  value: number;
  onChange: (value: number) => void;
}

export default function ProductStatusDropdown({ value, onChange }: Props) {
  const [open, setOpen] = useState(false);

  const selectedLabel =
    productStatusOptions.find((opt) => opt.value === value)?.label || "";

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
        <ul className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
          {productStatusOptions.map((opt) => (
            <li
              key={opt.value}
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
