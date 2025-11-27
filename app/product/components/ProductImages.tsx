"use client";
import { useState } from "react";

const toFullUrl = (url: string) => {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  return `https://image.msscdn.net${url}`;
};

interface ProductImagesProps {
  mainImg?: string;
  subImages?: string[];
}

export default function ProductImages({ mainImg, subImages }: ProductImagesProps) {
  const initialMainImg = toFullUrl(mainImg || "/images/default_main.png");
  const [mainImage, setMainImage] = useState(initialMainImg);

  const thumbnails: string[] = subImages?.length
    ? subImages.map((img) => toFullUrl(img))
    : [initialMainImg];

  return (
    <div className="flex flex-row gap-6">
      <div className="flex flex-col gap-2 overflow-y-auto max-h-[500px] min-w-[5rem]">
        {thumbnails.map((thumb, idx) => (
          <img
            key={idx}
            src={thumb}
            alt={`썸네일 ${idx}`}
            className={`w-20 h-20 object-contain rounded border ${
              mainImage === thumb ? "border-gray-800" : "border-gray-300"
            } hover:cursor-pointer`}
            onClick={() => setMainImage(thumb)}
          />
        ))}
      </div>

      <div className="flex-1 flex justify-center items-start">
        <img
          src={mainImage}
          alt="상품 이미지"
          className="rounded-lg object-contain max-h-[500px] w-full"
        />
      </div>
    </div>
  );
}
