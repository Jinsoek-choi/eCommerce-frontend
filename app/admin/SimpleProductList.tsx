"use client";

export default function SimpleProductList({
  products,
  loading,
  error,
  onSelect,
}: {
  products: { id: number; name: string }[];
  loading: boolean;
  error: boolean;
  onSelect: (id: number) => void;
}) {
  if (loading) {
    return (
      <div className="w-full h-[420px] flex items-center justify-center bg-gray-50 rounded-xl">
        상품 불러오는 중...
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-[420px] flex items-center justify-center bg-gray-50 rounded-xl">
        상품 목록을 불러올 수 없습니다.
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="w-full h-[420px] flex items-center justify-center bg-gray-50 rounded-xl text-gray-500">
        등록된 상품이 없습니다.
      </div>
    );
  }

  return (
    <div className="w-full h-[420px] overflow-y-auto bg-gray-50 rounded-xl p-4">
      {products.map((p) => (
        <div
          key={p.id}
          onClick={() => onSelect(p.id)}
          className="cursor-pointer px-3 py-2 hover:bg-gray-200 rounded-lg"
        >
          {p.name}
        </div>
      ))}
    </div>
  );
}
