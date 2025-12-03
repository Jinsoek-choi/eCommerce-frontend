"use client";
import React, { useState } from "react";
import { X } from "lucide-react";

interface ImageUploadProps {
  image?: string;
  onChange: (value: string) => void;
}

export default function ImageUpload({ image, onChange }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(image || null);

  const removeImage = () => {
    setPreview(null);
    onChange("");
  };

  return (
    <div className="flex flex-col items-center w-full relative">
      <div className="w-full rounded-xl border-2 border-dashed border-gray-300 mb-4 flex items-center justify-center relative">
        <div className="w-full pt-[100%] relative">
          {preview ? (
            <>
              <img
                src={preview}
                alt="Preview"
                className="absolute top-0 left-0 w-full h-full object-contain rounded-xl"
              />
              {/* 삭제 버튼 */}
              <button
                type="button"
                onClick={removeImage}
                className="absolute top-2 right-2 bg-black bg-opacity-50 text-white rounded-full w-6 h-6 flex items-center justify-center cursor-pointer"
              >
                <X size={14} />
              </button>
            </>
          ) : (
            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-gray-400 text-sm md:text-base">
              이미지 미리보기
            </span>
          )}
        </div>
      </div>

      <input
        type="file"
        accept="image/*"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = () => {
              onChange(reader.result as string);
              setPreview(reader.result as string);
            };
            reader.readAsDataURL(e.target.files[0]);
          }
        }}
        className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 transition
          file:border-0
          file:bg-gray-600
          file:text-white
          file:rounded-lg
          file:py-2
          file:px-4
          file:cursor-pointer
          file:hover:bg-gray-700"
      />
    </div>
  );
}
