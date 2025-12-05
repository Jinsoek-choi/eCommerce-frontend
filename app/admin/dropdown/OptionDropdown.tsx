import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

interface Props {
  value: "N" | "C";
  onChange: (val: "N" | "C") => void;
}

export default function OptionDropdown({ value, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const options: { label: string; value: "N" | "C" }[] = [
    { label: "일반", value: "N" },
    { label: "색상", value: "C" },
  ];

  return (
    <div className="relative w-full" ref={ref}>
      <button
        type="button"
        className="w-full border rounded px-2 py-1 text-sm flex justify-between items-center cursor-pointer bg-white"
        onClick={() => setOpen(!open)}
      >
        {options.find((opt) => opt.value === value)?.label}
        <ChevronDown className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <ul className="absolute z-10 w-full bg-white border rounded mt-1 shadow-md">
          {options.map((opt) => (
            <li
              key={opt.value}
              className={`px-2 py-1 text-sm cursor-pointer hover:bg-gray-100 ${
                opt.value === value ? "bg-gray-200 font-semibold" : ""
              }`}
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
            >
              {opt.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
