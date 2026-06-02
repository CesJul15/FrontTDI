<template>
  <div class="row">
    <div class="col-lg-6 mb-4">
      <div v-if="product" class="card mb-4">
        <div class="product-image-container">
          <img
            v-if="selectedImage"
            :src="getMediaUrl(selectedImage)"
            class="card-img-top product-main-img"
            :alt="product.name"
            @dblclick="openZoomModal"
            title="Doble click Para Ver Foto"
          />
          <div class="zoom-hint">Ver Foto</div>
        </div>
        <div class="card-body py-3">
          <div class="d-flex flex-wrap gap-2 thumbnail-list">
            <img
              v-for="(image, index) in product.images"
              :key="index"
              :src="getMediaUrl(image.image)"
              :alt="`${product.name} ${index + 1}`"
              :class="['thumbnail-img', { active: selectedImage === image.image }]"
              @click="selectedImage = image.image"
            />
          </div>
        </div>
      </div>
    </div>

    <div class="col-lg-6">
      <div v-if="product" class="card mb-4">
        <div class="card-body">
          <h3>{{ product.name }}</h3>
          <p>{{ product.description }}</p>
          <p class="fw-bold">Precio: ${{ product.price }}</p>
          <p>Stock: {{ product.stock }}</p>
          <div class="d-flex gap-2 align-items-center">
            <button class="btn btn-success" @click="buyNow">Comprar</button>
            <button class="btn btn-primary" @click="addProductToCart">Agregar al carrito</button>
            <button 
              class="btn btn-outline-danger" 
              @click="addWishlist"
              title="Agregar a lista de deseos"
              style="font-size: 1.5rem; padding: 0.5rem 0.75rem; border-width: 2px;">
              ❤️
            </button>
            <button 
              class="btn btn-outline-info ms-auto" 
              @click="toggleAdditionalInfo"
              title="Ver el origen del instrumento">
              <span v-if="loadingAdditionalInfo" class="spinner-border spinner-border-sm me-1"></span>
              <i :class="['bi', showAdditionalInfo ? 'bi-globe-fill' : 'bi-globe', 'me-2']"></i>
              🌍 Ver origen
            </button>
          </div>
        </div>
      </div>

      <!-- Información adicional: Origen del instrumento -->
      <transition name="slide-fade">
        <div v-if="showAdditionalInfo" class="card mt-4 additional-info-card">
          <div class="card-header bg-gradient-info">
            <h5 class="mb-0">
              <i class="bi bi-globe me-2"></i>🌍 Información del Instrumento
            </h5>
          </div>
          <div class="card-body">
            <div v-if="loadingAdditionalInfo" class="alert alert-info">
              <div class="spinner-border spinner-border-sm me-2"></div>
              Cargando información...
            </div>

            <div v-else-if="additionalInfo && additionalInfo.origen && additionalInfo.origen !== 'No especificado'" class="mb-4 p-3 tag-section rounded">
              <h6 class="text-primary mb-3"><i class="bi bi-geo-alt-fill me-2"></i>Origen</h6>
              <p class="mb-2"><strong style="font-size: 1.2rem; color: #ff6b6b;">{{ additionalInfo.origen }}</strong></p>
              <p class="mb-0"><small class="text-muted">📍 País/Región de procedencia</small></p>
            </div>

            <div v-else-if="additionalInfo?.origen" class="alert alert-info">
              <i class="bi bi-info-circle me-2"></i>
              <strong>Origen:</strong> {{ additionalInfo.origen }}
            </div>
            <div v-else class="alert alert-warning">
              <i class="bi bi-exclamation-triangle me-2"></i>
              <strong>Origen:</strong> No especificado aún
            </div>
          </div>
        </div>
      </transition>
    </div>
  </div>

  <!-- Reviews Section -->
  <div class="row mt-5">
    <div class="col-lg-8">
      <div class="card">
        <div class="card-header bg-light d-flex justify-content-between align-items-center">
          <h5 class="mb-0">⭐ Reseñas y Valoraciones</h5>
          <span v-if="product" class="badge bg-primary">{{ product.reviews_count || 0 }} reseñas</span>
        </div>
        <div class="card-body">
          <!-- Rating Summary -->
          <div v-if="product" class="rating-summary mb-4 p-3 bg-light rounded">
            <div class="d-flex align-items-center gap-3">
              <div>
                <div class="rating-average">{{ product.avg_rating || 'N/A' }}</div>
                <div class="stars-display">{{ renderStars(product.avg_rating || 0) }}</div>
              </div>
              <div class="flex-grow-1">
                <p class="mb-1"><small class="text-muted">{{ product.reviews_count || 0 }} reseñas</small></p>
              </div>
            </div>
          </div>

          <!-- Add Review Form -->
          <div v-if="!showReviewForm" class="mb-4">
            <button class="btn btn-primary" @click="showReviewForm = true">+ Escribir una reseña</button>
          </div>
          <div v-else class="mb-4 p-3 bg-light rounded">
            <h6>Comparte tu opinión</h6>
            <div class="mb-3">
              <label class="form-label">Valoración (1-5 estrellas)</label>
              <div class="d-flex gap-2">
                <button
                  v-for="i in 5"
                  :key="i"
                  @click="newReview.rating = i"
                  class="btn btn-sm"
                  :class="{ 'btn-warning': newReview.rating === i, 'btn-outline-warning': newReview.rating !== i }"
                >
                  {{ renderStars(i) }}
                </button>
              </div>
            </div>
            <div class="mb-3">
              <label class="form-label">Comentario</label>
              <textarea class="form-control" v-model="newReview.comment" placeholder="Comparte tu experiencia con este instrumento..." rows="3"></textarea>
            </div>
            <div class="d-flex gap-2">
              <button class="btn btn-primary" @click="submitReview">Enviar reseña</button>
              <button class="btn btn-secondary" @click="showReviewForm = false">Cancelar</button>
            </div>
          </div>

          <!-- Reviews List -->
          <div v-if="reviews.length" class="reviews-list">
            <div v-for="review in reviews" :key="review.id" class="review-item p-3 border-bottom">
              <div class="d-flex justify-content-between align-items-start mb-2">
                <div>
                  <strong class="d-block">{{ review.user?.username || 'Anónimo' }}</strong>
                  <small class="text-muted">{{ new Date(review.created_at).toLocaleDateString('es-ES') }}</small>
                </div>
                <span class="badge bg-info">{{ renderStars(review.rating) }}</span>
              </div>
              <p class="mb-0">{{ review.comment }}</p>
            </div>
          </div>
          <div v-else class="alert alert-info">
            <small>No hay reseñas aún. ¡Sé el primero en comentar!</small>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal Zoom para imagen -->
  <div v-if="showZoomModal" class="zoom-modal" @click="closeZoomModal">
    <div class="zoom-modal-content" @click.stop>
      <button class="zoom-close-btn" @click="closeZoomModal">✕</button>
      <img
        :src="getMediaUrl(selectedImage)"
        :alt="product.name"
        class="zoomed-image"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import api, { getMediaUrl } from "../services/api";
import { addToCart as addToCartItem } from "../services/cart";

const route = useRoute();
const product = ref(null);
const selectedImage = ref("");
const additionalInfo = ref(null);
const reviews = ref([]);
const showReviewForm = ref(false);
const showAdditionalInfo = ref(false);
const loadingAdditionalInfo = ref(false);
const newReview = ref({ rating: 5, comment: "" });
const showZoomModal = ref(false);

async function loadProduct() {
  try {
    const response = await api.get(`/instrumentos/${route.params.id}/`);
    product.value = response.data;
    selectedImage.value = response.data.images?.[0]?.image || "";
    // Cargar reseñas
    loadReviews();
  } catch (error) {
    console.error(error);
  }
}

async function loadAdditionalInfo() {
  try {
    loadingAdditionalInfo.value = true;
    console.log(`Cargando información adicional para instrumento ID: ${route.params.id}`);
    const response = await api.get(`/instrumentos/${route.params.id}/additional_info/`);
    console.log("✅ Respuesta del servidor:", response.data);
    console.log("   - origen:", response.data?.origen);
    additionalInfo.value = response.data;
  } catch (error) {
    console.error("❌ Error cargando información adicional:", error);
    additionalInfo.value = { error: true };
  } finally {
    loadingAdditionalInfo.value = false;
  }
}

function toggleAdditionalInfo() {
  showAdditionalInfo.value = !showAdditionalInfo.value;
  if (showAdditionalInfo.value && !additionalInfo.value) {
    loadAdditionalInfo();
  }
}

async function loadReviews() {
  try {
    const response = await api.get(`/reviews/`, { params: { instrumento: route.params.id } });
    reviews.value = response.data;
  } catch (error) {
    console.error("Error cargando reseñas:", error);
  }
}

async function submitReview() {
  try {
    await api.post("/reviews/", {
      instrumento: route.params.id,
      rating: newReview.value.rating,
      comment: newReview.value.comment,
    });
    alert("¡Reseña enviada! Gracias por tu opinión.");
    showReviewForm.value = false;
    newReview.value = { rating: 5, comment: "" };
    loadReviews();
  } catch (error) {
    alert("Error al enviar la reseña.");
    console.error(error);
  }
}

function renderStars(rating) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5 ? 1 : 0;
  let stars = "⭐".repeat(full);
  if (half) stars += "✨";
  return stars;
}

async function addWishlist() {
  try {
    await api.post("/wishlist/", { instrumento_id: product.value.id });
    alert("Instrumento agregado a la lista de deseos.");
  } catch (error) {
    alert("Error al agregar a la lista de deseos.");
  }
}

function addProductToCart() {
  addToCartItem({ instrumento: product.value, quantity: 1 });
  alert("Instrumento agregado al carrito.");
}

async function buyNow() {
  try {
    const orderPayload = {
      total: product.value.price,
      items: [{ instrumento_id: product.value.id, quantity: 1 }],
    };
    await api.post("/ordenes/", orderPayload);
    alert("Compra registrada. Revisa tu correo para la confirmación.");
  } catch (error) {
    alert("Error al procesar la compra.");
  }
}

function openZoomModal() {
  showZoomModal.value = true;
  document.body.style.overflow = "hidden";
}

function closeZoomModal() {
  showZoomModal.value = false;
  document.body.style.overflow = "auto";
}

onMounted(loadProduct);
</script>

<style scoped>
.product-main-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  object-position: center;
  border-radius: 8px;
  transition: transform 0.3s ease;
  cursor: zoom-in;
}

.product-main-img:hover {
  transform: scale(1.02);
}

.thumbnail-img {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border: 2px solid transparent;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.25s ease;
}

.thumbnail-img:hover {
  transform: scale(1.08);
}

.thumbnail-img.active {
  border-color: #ff6b6b;
  box-shadow: 0 2px 8px rgba(255, 107, 107, 0.3);
}

/* Additional Info Card Animations */
.slide-fade-enter-active {
  transition: all 0.3s ease;
}

.slide-fade-leave-active {
  transition: all 0.2s ease;
}

.slide-fade-enter-from {
  transform: translateY(-10px);
  opacity: 0;
}

.slide-fade-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}

.additional-info-card {
  border: 2px solid #4ecdc4;
  box-shadow: 0 4px 16px rgba(78, 205, 196, 0.15);
  animation: slideUp 0.35s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.bg-gradient-info {
  background: linear-gradient(135deg, #4ecdc4 0%, #44b393 100%) !important;
  color: white !important;
}

.bg-gradient-info h5 {
  color: white;
  font-weight: 600;
}

.tag-section {
  background: linear-gradient(135deg, #f0f9ff 0%, #e6f7f5 100%);
  border-left: 4px solid #4ecdc4;
}

.tag-section h6 {
  color: #1a7f78;
}

.artist-item {
  transition: all 0.2s ease;
  padding: 0.75rem 0.5rem !important;
}

.artist-item:hover {
  background-color: #f8f9fa;
  transform: translateX(4px);
}

.artist-rank {
  font-size: 0.7rem;
  padding: 0.3rem 0.6rem !important;
  font-weight: 700;
}

.artists-section {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 2px solid #e9ecef;
}

.artists-section h6 {
  color: #1a7f78;
  font-weight: 600;
}

.rating-summary {
  border-left: 4px solid #ff6b6b;
}

.rating-average {
  font-size: 2.5rem;
  font-weight: 700;
  color: #ff6b6b;
}

.stars-display {
  font-size: 1.25rem;
}

.review-item {
  transition: background-color 0.2s ease;
}

.review-item:hover {
  background-color: #f8f9fa !important;
}

.btn-primary {
  transition: all 0.2s ease;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 107, 107, 0.3);
}

.btn-info {
  transition: all 0.2s ease;
  background: linear-gradient(135deg, #4ecdc4 0%, #44b393 100%);
  border: none;
}

.btn-info:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(78, 205, 196, 0.3);
}

.btn-warning {
  transition: all 0.2s ease;
}

.btn-warning:hover {
  transform: scale(1.15);
}

.form-control:focus {
  border-color: #ff6b6b;
  box-shadow: 0 0 0 0.2rem rgba(255, 107, 107, 0.25);
}

.reviews-list {
  max-height: 500px;
  overflow-y: auto;
}

/* Contenedor de imagen con tamaño fijo */
.product-image-container {
  position: relative;
  width: 100%;
  height: 420px;
  overflow: hidden;
  border-radius: 8px;
  background-color: #f5f5f5;
}

.product-main-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  object-position: center;
  border-radius: 8px;
  transition: transform 0.3s ease;
  cursor: zoom-in;
}

.product-main-img:hover {
  transform: scale(1.02);
}

/* Indicador de zoom */
.zoom-hint {
  position: absolute;
  bottom: 10px;
  right: 10px;
  background-color: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 0.85rem;
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.product-image-container:hover .zoom-hint {
  opacity: 1;
}

/* Modal Zoom */
.zoom-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  animation: fadeIn 0.2s ease;
}

.zoom-modal-content {
  position: relative;
  max-width: 90vw;
  max-height: 90vh;
  overflow: auto;
}

.zoomed-image {
  max-width: 100%;
  max-height: 90vh;
  width: auto;
  height: auto;
  border-radius: 8px;
}

.zoom-close-btn {
  position: fixed;
  top: 20px;
  right: 30px;
  background-color: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  font-size: 1.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  z-index: 10000;
  color: #333;
}

.zoom-close-btn:hover {
  background-color: white;
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@media (max-width: 768px) {
  .product-image-container {
    height: 280px;
  }

  .product-main-img {
    height: 280px;
  }
  
  .thumbnail-img {
    width: 60px;
    height: 60px;
  }
  
  .rating-average {
    font-size: 1.75rem;
  }
  
  .btn-info {
    font-size: 0.85rem;
  }

  .zoom-close-btn {
    width: 40px;
    height: 40px;
    font-size: 1.2rem;
    top: 10px;
    right: 15px;
  }
}
</style>
