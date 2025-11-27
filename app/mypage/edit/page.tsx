"use client";

import { useState, useEffect } from "react";

interface UserInfo {
  password: string;
  phone: string;
}

interface Address {
  id: number;
  name: string;
  phone: string;
  address: string;
  detail: string;
  isDefault: boolean;
}

export default function MyInfoPage() {
  const [user, setUser] = useState<UserInfo>({ password: "", phone: "" });
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(false);

  const [newAddress, setNewAddress] = useState({
    name: "",
    phone: "",
    address: "",
    detail: "",
  });

  const [editAddressId, setEditAddressId] = useState<number | null>(null);
  const [editAddressData, setEditAddressData] = useState({
    name: "",
    phone: "",
    address: "",
    detail: "",
  });

  useEffect(() => {
    const savedUser = localStorage.getItem("myInfo");
    const savedAddresses = localStorage.getItem("myAddresses");
    if (savedUser) setUser(JSON.parse(savedUser));
    if (savedAddresses) setAddresses(JSON.parse(savedAddresses));
  }, []);

  const handleUserChange = (field: keyof UserInfo, value: string) => {
    setUser({ ...user, [field]: value });
  };

  const handleSaveUser = () => {
    if (!user.password || !user.phone) {
      alert("비밀번호와 전화번호는 필수 입력입니다.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      localStorage.setItem("myInfo", JSON.stringify(user));
      setLoading(false);
      alert("내 정보가 저장되었습니다!");
    }, 400);
  };

  const addAddress = () => {
    if (!newAddress.name || !newAddress.phone || !newAddress.address) {
      alert("이름, 전화번호, 주소는 필수입니다.");
      return;
    }
    const next = [
      ...addresses,
      { id: Date.now(), ...newAddress, isDefault: addresses.length === 0 },
    ];
    setAddresses(next);
    localStorage.setItem("myAddresses", JSON.stringify(next));
    setNewAddress({ name: "", phone: "", address: "", detail: "" });
  };

  const setDefaultAddress = (id: number) => {
    const updated = addresses.map((a) =>
      a.id === id ? { ...a, isDefault: true } : { ...a, isDefault: false }
    );
    setAddresses(updated);
    localStorage.setItem("myAddresses", JSON.stringify(updated));
  };

  const deleteAddress = (id: number) => {
    const target = addresses.find((a) => a.id === id);
    if (target?.isDefault) {
      alert("기본 배송지는 삭제할 수 없습니다.");
      return;
    }
    const updated = addresses.filter((a) => a.id !== id);
    setAddresses(updated);
    localStorage.setItem("myAddresses", JSON.stringify(updated));
  };

  const startEditAddress = (addr: Address) => {
    setEditAddressId(addr.id);
    setEditAddressData({
      name: addr.name,
      phone: addr.phone,
      address: addr.address,
      detail: addr.detail,
    });
  };

  const saveEditAddress = () => {
    if (!editAddressData.name || !editAddressData.phone || !editAddressData.address) {
      alert("이름, 전화번호, 주소는 필수입니다.");
      return;
    }
    const updated = addresses.map((a) =>
      a.id === editAddressId ? { ...a, ...editAddressData } : a
    );
    setAddresses(updated);
    localStorage.setItem("myAddresses", JSON.stringify(updated));
    setEditAddressId(null);
    setEditAddressData({ name: "", phone: "", address: "", detail: "" });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto space-y-10">

        {/* 내 정보 */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold mb-4">내 정보</h2>
          <div className="space-y-3">
            <input
              type="password"
              value={user.password}
              onChange={(e) => handleUserChange("password", e.target.value)}
              placeholder="비밀번호"
              className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-black"
            />
            <input
              type="text"
              value={user.phone}
              onChange={(e) => handleUserChange("phone", e.target.value)}
              placeholder="전화번호"
              className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-black"
            />
            <button
              onClick={handleSaveUser}
              disabled={loading}
              className={`w-full py-2 mt-2 font-semibold rounded ${
                loading ? "bg-gray-300" : "bg-black text-white hover:bg-gray-800"
              } cursor-pointer`}
            >
              {loading ? "저장 중..." : "저장"}
            </button>
          </div>
        </div>

        {/* 배송지 목록 */}
        <div className="space-y-4">
          {addresses.map((a) => (
            <div
              key={a.id}
              className="bg-white border border-gray-200 rounded-lg p-4 flex flex-col md:flex-row justify-between items-start md:items-center shadow-sm"
            >
              {editAddressId === a.id ? (
                <div className="flex-1 space-y-2 w-full">
                  <input
                    type="text"
                    value={editAddressData.name}
                    onChange={(e) =>
                      setEditAddressData({ ...editAddressData, name: e.target.value })
                    }
                    className="w-full border-b border-gray-300 py-1 focus:outline-none focus:border-black"
                  />
                  <input
                    type="text"
                    value={editAddressData.phone}
                    onChange={(e) =>
                      setEditAddressData({ ...editAddressData, phone: e.target.value })
                    }
                    className="w-full border-b border-gray-300 py-1 focus:outline-none focus:border-black"
                  />
                  <input
                    type="text"
                    value={editAddressData.address}
                    onChange={(e) =>
                      setEditAddressData({ ...editAddressData, address: e.target.value })
                    }
                    className="w-full border-b border-gray-300 py-1 focus:outline-none focus:border-black"
                  />
                  <input
                    type="text"
                    value={editAddressData.detail}
                    onChange={(e) =>
                      setEditAddressData({ ...editAddressData, detail: e.target.value })
                    }
                    className="w-full border-b border-gray-300 py-1 focus:outline-none focus:border-black"
                  />
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={saveEditAddress}
                      className="px-3 py-1 bg-black text-white text-sm rounded hover:bg-gray-800 cursor-pointer"
                    >
                      저장
                    </button>
                    <button
                      onClick={() => setEditAddressId(null)}
                      className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded hover:bg-gray-300 cursor-pointer"
                    >
                      취소
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex-1 w-full">
                  <p className="font-semibold">{a.name} {a.isDefault && <span className="text-gray-500 text-sm">(기본)</span>}</p>
                  <p className="text-gray-600 text-sm">{a.phone}</p>
                  <p className="text-gray-600 text-sm">{a.address} {a.detail}</p>
                </div>
              )}

              {!editAddressId && (
                <div className="flex gap-3 mt-3 md:mt-0">
                  {!a.isDefault && (
                    <>
                      <button
                        onClick={() => startEditAddress(a)}
                        className="text-sm text-gray-700 hover:underline cursor-pointer"
                      >
                        수정
                      </button>
                      <button
                        onClick={() => deleteAddress(a.id)}
                        className="text-sm text-red-500 hover:underline cursor-pointer"
                      >
                        삭제
                      </button>
                      <button
                        onClick={() => setDefaultAddress(a.id)}
                        className="text-sm text-blue-600 hover:underline cursor-pointer"
                      >
                        기본 설정
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* 배송지 추가 */}
        <div className="bg-white p-4 border border-gray-200 rounded-lg space-y-3 shadow-sm">
          <input
            type="text"
            placeholder="이름"
            value={newAddress.name}
            onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })}
            className="w-full border-b border-gray-300 py-1 focus:outline-none focus:border-black"
          />
          <input
            type="text"
            placeholder="전화번호"
            value={newAddress.phone}
            onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
            className="w-full border-b border-gray-300 py-1 focus:outline-none focus:border-black"
          />
          <input
            type="text"
            placeholder="주소"
            value={newAddress.address}
            onChange={(e) => setNewAddress({ ...newAddress, address: e.target.value })}
            className="w-full border-b border-gray-300 py-1 focus:outline-none focus:border-black"
          />
          <input
            type="text"
            placeholder="상세주소"
            value={newAddress.detail}
            onChange={(e) => setNewAddress({ ...newAddress, detail: e.target.value })}
            className="w-full border-b border-gray-300 py-1 focus:outline-none focus:border-black"
          />
          <button
            onClick={addAddress}
            className="w-full py-2 bg-black text-white rounded hover:bg-gray-800 font-semibold cursor-pointer"
          >
            배송지 추가
          </button>
        </div>
      </div>
    </div>
  );
}
