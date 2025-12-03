"use client";
import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

interface MultiImageUploadProps {
  images: string[];
  onChange: (imgs: string[]) => void;
}

export default function MultiImageUpload({ images, onChange }: MultiImageUploadProps) {
  const [previews, setPreviews] = useState<string[]>(images || []);

  useEffect(() => {
    setPreviews(images || []);
  }, [images]);

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const filesArray = Array.from(e.target.files);

    filesArray.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setPreviews((prev) => {
          const updated = [...prev, result];
          onChange(updated);
          return updated;
        });
      };
      reader.readAsDataURL(file);
    });

    // 같은 파일 재선택 가능하도록 초기화
    e.target.value = "";
  };

  const removeImage = (idx: number) => {
    const updated = previews.filter((_, i) => i !== idx);
    setPreviews(updated);
    onChange(updated);
  };

  return (
    <div className="flex flex-col gap-2">
      {/* 파일 추가 버튼 */}
      <label className="w-full cursor-pointer border border-gray-300 p-2 rounded-lg text-center bg-gray-100 hover:bg-gray-200 transition">
        + 이미지 추가
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFiles}
          className="hidden"
        />
      </label>

      {/* 썸네일 */}
      <div className="flex gap-2 flex-wrap mt-2">
        {previews.map((img, idx) => (
          <div key={idx} className="relative w-24 h-24 rounded-lg overflow-hidden border border-gray-200">
            <img src={img} alt={`sub-img-${idx}`} className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => removeImage(idx)}
              className="absolute top-1 right-1 bg-black bg-opacity-50 text-white rounded-full w-6 h-6 flex items-center justify-center cursor-pointer"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
