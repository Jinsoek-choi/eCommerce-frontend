"use client";

interface InputProps {
  label: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
}

const Input: React.FC<InputProps> = ({ label, value, onChange, type = "text" }) => (
  <div className="flex flex-col">
    <label className="text-sm font-semibold text-gray-700">{label}</label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      className="mt-1 p-2 border rounded-md shadow-sm"
    />
  </div>
);

export default Input;
