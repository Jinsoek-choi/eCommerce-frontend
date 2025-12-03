"use client";

import { useEffect, useState } from "react";

interface CategoryNode {
  title: string;
  children?: { [code: string]: CategoryNode | string };
}

interface CategoryTree {
  [bigCode: string]: CategoryNode;
}

interface CategorySelectorProps {
  data: CategoryTree; // 전체 카테고리 트리
  selectedCode?: string; // 초기 선택 leaf 코드
  onSelect: (leafCode: string) => void; // 선택된 leaf 코드 전달
}

export default function CategorySelector({ data, selectedCode, onSelect }: CategorySelectorProps) {
  const [selectedBig, setSelectedBig] = useState<string>("");
  const [selectedMid, setSelectedMid] = useState<string>("");
  const [selectedLeaf, setSelectedLeaf] = useState<string>("");

  // 초기 선택값 적용
  useEffect(() => {
    if (!selectedCode || !data) return;

    for (const [bigCode, bigNode] of Object.entries(data)) {
      for (const [midCode, midNode] of Object.entries(bigNode.children || {})) {
        if ((midNode as CategoryNode).children && selectedCode in (midNode as CategoryNode).children!) {
          setSelectedBig(bigCode);
          setSelectedMid(midCode);
          setSelectedLeaf(selectedCode);
          return;
        }
      }
    }
  }, [selectedCode, data]);

  const bigList = Object.entries(data || {});
  const midList = selectedBig ? Object.entries(data[selectedBig].children || {}) : [];
  const leafList =
    selectedBig && selectedMid
      ? Object.entries(
        ((data[selectedBig].children![selectedMid] as CategoryNode).children) || {}
      )
      : [];

  const selectedPath =
    selectedBig && selectedMid && selectedLeaf
      ? `${data[selectedBig].title} > ${(data[selectedBig].children![selectedMid] as CategoryNode).title
      } > ${(data[selectedBig].children![selectedMid] as CategoryNode).children![selectedLeaf]}`
      : "카테고리를 선택하세요";

  return (
    <div className="space-y-3">
      {/* 선택된 카테고리 표시 */}
      <div className="p-3 bg-gray-50 rounded-lg border text-sm text-gray-700">
        {selectedPath}
      </div>

      {/* 대분류 */}
      <div className="flex flex-wrap gap-2">
        {bigList.map(([code, node]) => (
          <div
            key={code}
            className={`px-3 py-2 rounded-lg cursor-pointer border text-sm font-medium transition-colors ${selectedBig === code
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white hover:bg-gray-100 border-gray-300"
              }`}
            onClick={() => {
              setSelectedBig(code);
              setSelectedMid("");
              setSelectedLeaf("");
            }}
          >
            {node.title}
          </div>
        ))}
      </div>

      {/* 중분류 */}
      {selectedBig && (
        <div className="flex flex-wrap gap-2">
          {midList.map(([code, node]) => (
            <div
              key={code}
              className={`px-3 py-1.5 rounded-lg cursor-pointer border text-sm font-medium transition-colors ${selectedMid === code
                  ? "bg-blue-500 text-white border-blue-500"
                  : "bg-white hover:bg-gray-100 border-gray-300"
                }`}
              onClick={() => {
                setSelectedMid(code);
                setSelectedLeaf("");
              }}
            >
              {(node as CategoryNode).title}
            </div>
          ))}
        </div>
      )}

      {/* 소분류 */}
      {selectedMid && (
        <div className="flex flex-wrap gap-2">
          {leafList.map(([code, name]) => {
            const leafName = name as string; // string으로 강제
            return (
              <div
                key={code}
                className={`px-3 py-1.5 rounded-lg cursor-pointer border text-sm font-medium transition-colors ${selectedLeaf === code
                    ? "bg-blue-400 text-white border-blue-400"
                    : "bg-white hover:bg-gray-100 border-gray-300"
                  }`}
                onClick={() => {
                  setSelectedLeaf(code);
                  onSelect(code);
                }}
              >
                {leafName}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
