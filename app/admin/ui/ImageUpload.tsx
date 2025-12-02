"use client";

interface ImageUploadProps {
  image: string | undefined;
  onChange: (value: string) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ image, onChange }) => (
  <div className="flex flex-col">
    <label className="text-sm font-semibold text-gray-700">상품 이미지</label>
    <input
      type="file"
      onChange={(e) => onChange(URL.createObjectURL(e.target.files![0]))}
      className="mt-1"
    />
    {image && <img src={image} alt="상품 이미지 미리보기" className="mt-2" />}
  </div>
);

export default ImageUpload;
