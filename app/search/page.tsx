"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function SearchPage() {
  const params = useSearchParams();
  const keyword = params.get("keyword");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!keyword) return;

    const fetchResults = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?query=${encodeURIComponent(keyword)}`);
        const data = await res.json();
        setResults(data.items || []);
      } catch (error) {
        console.error("검색 오류:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [keyword]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">
        “{keyword}” 검색 결과
      </h2>

      {loading && <p>검색 중입니다...</p>}

      {!loading && results.length === 0 && <p>검색 결과가 없습니다.</p>}

      {!loading && results.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {results.map((item, i) => (
            <div
              key={i}
              className="p-3 bg-white rounded shadow hover:shadow-lg transition"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-40 object-contain"
              />
              <p
                className="text-sm mt-2"
                dangerouslySetInnerHTML={{ __html: item.title }}
              />
              <p className="text-blue-600 font-bold">{item.lprice}원</p>
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-gray-500 underline"
              >
                상품 보기
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
