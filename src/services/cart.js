const STORAGE_KEY = "enfa_cart_items";

function loadCart() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveCart(items) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event("cartUpdated"));
}

export function getCart() {
  return loadCart();
}

export function getItemCount() {
  return loadCart().reduce((sum, item) => sum + item.quantity, 0);
}

export function getCartTotal() {
  return loadCart().reduce((sum, item) => sum + item.price * item.quantity, 0);
}

export function addToCart({ instrumento, quantity = 1 }) {
  const items = loadCart();
  const existing = items.find((item) => item.instrumento_id === instrumento.id);
  if (existing) {
    existing.quantity += quantity;
  } else {
    items.push({
      instrumento_id: instrumento.id,
      name: instrumento.name,
      price: instrumento.price,
      quantity,
      image: instrumento.images?.[0]?.image || "",
    });
  }
  saveCart(items);
}

export function updateCartItem(instrumento_id, quantity) {
  const items = loadCart().map((item) => {
    if (item.instrumento_id === instrumento_id) {
      return { ...item, quantity: Math.max(1, quantity) };
    }
    return item;
  });
  saveCart(items);
}

export function removeCartItem(instrumento_id) {
  const items = loadCart().filter((item) => item.instrumento_id !== instrumento_id);
  saveCart(items);
}

export function clearCart() {
  saveCart([]);
}
