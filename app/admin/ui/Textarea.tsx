"use client";

interface TextareaProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  rows: number;
}

const Textarea: React.FC<TextareaProps> = ({ label, value, onChange, rows }) => (
  <div className="flex flex-col">
    <label className="text-sm font-semibold text-gray-700">{label}</label>
    <textarea
      value={value}
      onChange={onChange}
      rows={rows}
      className="mt-1 p-2 border rounded-md shadow-sm"
    />
  </div>
);

export default Textarea;
