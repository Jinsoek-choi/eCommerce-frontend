export function addToCart(item: { id: number; name: string; price: number; img: string }) {
  const cart = JSON.parse(localStorage.getItem("cart") || "[]");
  cart.push(item);
  localStorage.setItem("cart", JSON.stringify(cart));
}
