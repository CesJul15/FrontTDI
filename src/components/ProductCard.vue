<template>
  <div class="product-card-container">
    <div class="card product-card h-100">
      <div class="card-image-wrapper">
        <img
          v-if="product.images.length"
          :src="getMediaUrl(product.images[0].image)"
          class="card-img-top product-card-img"
          :alt="product.name"
        />
        <div v-else class="card-img-top d-flex align-items-center justify-content-center bg-light" style="height:220px;">
          <small class="text-muted">Sin imagen</small>
        </div>
        <div class="card-overlay">
          <button class="btn btn-primary btn-sm" @click="goToDetail">
            <i class="bi bi-eye-fill me-1"></i>Ver más
          </button>
        </div>
      </div>
      <div class="card-body d-flex flex-column">
        <h5 class="card-title">{{ product.name }}</h5>
        <p class="card-text text-muted text-truncate">{{ product.description }}</p>
        
        <!-- Stars Rating -->
        <div class="rating-stars mb-2" v-if="product.avg_rating">
          <span class="stars">{{ renderStars(product.avg_rating) }}</span>
          <span class="rating-value">{{ product.avg_rating }}</span>
          <span class="reviews-count text-muted">({{ product.reviews_count }})</span>
        </div>
        <div v-else class="text-muted mb-2"><small>Sin reseñas aún</small></div>

        <div class="product-price">
          <span class="price-label">Precio</span>
          <span class="price-value">${{ product.price }}</span>
        </div>
        <div class="product-stock mt-auto">
          <small v-if="product.stock > 0" class="badge bg-success">En stock</small>
          <small v-else class="badge bg-danger">Agotado</small>
        </div>
        <div class="mt-3 d-flex justify-content-between gap-2">
          <button class="btn btn-primary btn-sm flex-grow-1 btn-add-cart" @click="addToCartItem">
            <i class="bi bi-cart-plus-fill me-1"></i>Agregar Al arrito
          </button>
          <button class="btn btn-outline-danger btn-sm btn-wishlist" @click="addToWishlist" :class="{ 'active': isInWishlist }">
            <i class="bi bi-heart-fill"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { getMediaUrl } from "../services/api";
import { addToCart } from "../services/cart";
import { useRouter } from "vue-router";

const props = defineProps({
  product: { type: Object, required: true },
});

const emit = defineEmits(["wishlist"]);
const router = useRouter();

function addToWishlist() {
  emit("wishlist", props.product.id);
}

function addToCartItem() {
  addToCart({ instrumento: props.product, quantity: 1 });
}

function goToDetail() {
  router.push(`/product/${props.product.id}`);
}

function renderStars(rating) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  let stars = "⭐".repeat(full);
  if (half) stars += "✨";
  return stars;
}

const isInWishlist = false;
</script>

<style scoped>
.product-card-container {
  height: 100%;
}

.product-card {
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
}

.product-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
}

.card-image-wrapper {
  position: relative;
  overflow: hidden;
  background: #f0f9ff;
}

.product-card-img {
  width: 100%;
  height: 220px;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.product-card:hover .product-card-img {
  transform: scale(1.08);
}

.card-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.product-card:hover .card-overlay {
  opacity: 1;
}

.card-title {
  font-size: 1rem;
  font-weight: 600;
  color: #2d3436;
  line-height: 1.3;
  margin-bottom: 0.5rem;
}

.card-text {
  font-size: 0.875rem;
  color: #636e72;
}

.rating-stars {
  font-size: 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.stars {
  font-size: 0.85rem;
}

.rating-value {
  font-weight: 600;
  color: #ff6b6b;
}

.reviews-count {
  font-size: 0.7rem;
}

.product-price {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0.75rem 0;
}

.price-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: #95a5a6;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.price-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #ff6b6b;
}

.product-stock {
  margin-bottom: 0.75rem;
}

.product-stock .badge {
  font-size: 0.75rem;
  padding: 0.4rem 0.8rem;
  animation: slideInFromLeft 0.3s ease;
}

.btn-add-cart {
  transition: all 0.2s ease;
  box-shadow: 0 2px 6px rgba(255, 107, 107, 0.2);
}

.btn-add-cart:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(255, 107, 107, 0.3);
}

.btn-wishlist {
  transition: all 0.2s ease;
}

.btn-wishlist:hover {
  transform: scale(1.12);
  box-shadow: 0 2px 6px rgba(255, 107, 107, 0.2);
}

.btn-wishlist.active {
  background-color: #ff6b6b !important;
  border-color: #ff6b6b !important;
  color: white !important;
}

@keyframes slideInFromLeft {
  from {
    opacity: 0;
    transform: translateX(-8px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
</style>
