<template>
  <div class="container mt-4">
    <div class="d-flex justify-content-between align-items-center mb-5">
      <div>
        <h2 class="h3">🛒 Carrito de compras</h2>
        <p class="text-muted mb-0">Revisa tus artículos antes de finalizar la compra.</p>
      </div>
    </div>

    <div v-if="items.length" class="table-responsive">
      <table class="table table-hover align-middle border">
        <thead class="table-light">
          <tr>
            <th>Instrumento</th>
            <th>Precio</th>
            <th>Cantidad</th>
            <th>Total</th>
            <th class="text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in items" :key="item.instrumento_id">
            <td class="d-flex align-items-center gap-3">
              <img v-if="item.image" :src="getMediaUrl(item.image)" class="cart-item-img" alt="item.name" />
              <span class="fw-bold">{{ item.name }}</span>
            </td>
            <td><strong>${{ item.price }}</strong></td>
            <td>
              <input
                type="number"
                min="1"
                class="form-control form-control-sm w-75"
                v-model.number="item.quantity"
                @change="changeQuantity(item.instrumento_id, item.quantity)"
              />
            </td>
            <td><strong class="text-success">${{ (item.price * item.quantity).toFixed(2) }}</strong></td>
            <td class="text-center">
              <button class="btn btn-sm btn-outline-danger" @click="removeItem(item.instrumento_id)">🗑️ Eliminar</button>
            </td>
          </tr>
        </tbody>
      </table>

      <div class="card mt-4 border-success">
        <div class="card-body d-flex justify-content-between align-items-center">
          <div class="fs-5"><strong>Total a pagar:</strong> <span class="text-success" style="font-size: 1.5rem;">{{ total.toFixed(2) }} $</span></div>
          <button class="btn btn-success btn-lg" @click="checkout">Finalizar Compra</button>
        </div>
      </div>
    </div>

    <div v-else class="alert alert-info">No hay artículos en el carrito.</div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import api from "../services/api";
import { getCart, updateCartItem, removeCartItem, clearCart } from "../services/cart";
import { getMediaUrl } from "../services/api";

const items = ref([]);
const total = computed(() => items.value.reduce((sum, item) => sum + item.price * item.quantity, 0));

function loadCart() {
  items.value = getCart();
}

function changeQuantity(instrumento_id, quantity) {
  updateCartItem(instrumento_id, quantity);
  loadCart();
}

function removeItem(instrumento_id) {
  removeCartItem(instrumento_id);
  loadCart();
}

async function checkout() {
  try {
    const orderPayload = {
      total: total.value,
      items: items.value.map((item) => ({ instrumento_id: item.instrumento_id, quantity: item.quantity })),
    };
    await api.post("/ordenes/", orderPayload);
    clearCart();
    loadCart();
    alert("Compra registrada. Revisa tu correo para la confirmación.");
  } catch (error) {
    alert("No se pudo procesar el pago.");
  }
}

onMounted(loadCart);
</script>
