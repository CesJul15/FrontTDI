<template>
  <div>
    <div class="welcome-section mb-5">
      <div>
        <h1 class="welcome-title">Bienvenido a EnFA</h1>
        <p class="welcome-subtitle">Descubre los mejores instrumentos musicales a tu alcance</p>
      </div>
    </div>

    <div class="row mb-4">
      <div class="col-lg-3">
        <FiltersSidebar @filters-changed="handleFiltersChanged" />
      </div>
      <div class="col-lg-9">
        <div v-if="searchQuery" class="alert alert-info mb-4">
          <i class="bi bi-search me-2"></i>Resultados de búsqueda para: <strong>{{ searchQuery }}</strong>
        </div>

        <div v-if="instrumentos.length" class="mb-5">
          <h2 class="section-title mb-4">
            <span v-if="searchQuery">🔍 Resultados Encontrados</span>
            <span v-else>🔥 Instrumentos Destacados</span>
          </h2>
          <div id="instrumentsCarousel" class="carousel slide carousel-custom" data-bs-ride="carousel" data-bs-interval="3500">
            <div class="carousel-indicators">
              <button
                v-for="(s, idx) in slides"
                :key="idx"
                type="button"
                :data-bs-target="'#instrumentsCarousel'"
                :data-bs-slide-to="idx"
                :class="{ active: idx === 0 }"
                aria-label="Slide"
              ></button>
            </div>

            <div class="carousel-inner">
              <div v-for="(slide, sIdx) in slides" :key="sIdx" :class="['carousel-item', { active: sIdx === 0 }]">
                <div class="container">
                  <div class="row gx-3">
                    <div v-for="inst in slide" :key="inst.id" class="col-6 col-md-4 col-lg-3">
                      <div class="card product-card mb-3" @click="openDetail(inst.id)" style="cursor:pointer">
                        <img v-if="inst.images && inst.images.length" :src="getMediaUrl(inst.images[0].image)" class="card-img-top" :alt="inst.name" style="height:180px; object-fit:cover;">
                        <div v-else class="card-img-top d-flex align-items-center justify-content-center bg-light" style="height:180px;">
                          <small class="text-muted">Sin imagen</small>
                        </div>
                        <div class="card-body py-2">
                          <h6 class="card-title text-truncate mb-1">{{ inst.name }}</h6>
                          <p class="card-text mb-0 text-primary fw-bold">${{ inst.price }}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <button class="carousel-control-prev" type="button" data-bs-target="#instrumentsCarousel" data-bs-slide="prev">
              <span class="carousel-control-prev-icon" aria-hidden="true"></span>
              <span class="visually-hidden">Anterior</span>
            </button>
            <button class="carousel-control-next" type="button" data-bs-target="#instrumentsCarousel" data-bs-slide="next">
              <span class="carousel-control-next-icon" aria-hidden="true"></span>
              <span class="visually-hidden">Siguiente</span>
            </button>
          </div>
        </div>

        <div v-else class="alert alert-warning">
          <i class="bi bi-exclamation-triangle me-2"></i>
          <span v-if="searchQuery">No se encontraron instrumentos con "{{ searchQuery }}"</span>
          <span v-else>No hay instrumentos disponibles en este momento</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import api, { getMediaUrl } from '../services/api'
import FiltersSidebar from '../components/FiltersSidebar.vue'

const instrumentos = ref([])
const router = useRouter()
const route = useRoute()
const searchQuery = ref('')
const filters = ref({})

function chunkArray(arr, size) {
  const res = []
  for (let i = 0; i < arr.length; i += size) {
    res.push(arr.slice(i, i + size))
  }
  return res
}

const slides = computed(() => chunkArray(instrumentos.value, 4))

function initCarousel() {
  nextTick(() => {
    const carouselElement = document.getElementById('instrumentsCarousel')
    if (carouselElement) {
      const carousel = new bootstrap.Carousel(carouselElement, {
        interval: 3500,
        wrap: true
      })
    }
  })
}

async function loadInstrumentos() {
  try {
    const params = {}
    const search = route.query.search
    if (search) {
      params.search = search
      searchQuery.value = search
    }
    // Apply filters
    if (filters.value.category) params.category = filters.value.category
    if (filters.value.price_min) params.price_min = filters.value.price_min
    if (filters.value.price_max) params.price_max = filters.value.price_max
    if (filters.value.ordering) params.ordering = filters.value.ordering
    
    const resp = await api.get('/instrumentos/', { params })
    instrumentos.value = resp.data
    initCarousel()
  } catch (e) {
    console.error('Error cargando instrumentos:', e)
  }
}

function handleFiltersChanged(newFilters) {
  filters.value = newFilters
  loadInstrumentos()
}

function openDetail(id) {
  router.push(`/product/${id}`)
}

watch(() => route.query.search, () => {
  loadInstrumentos()
})

onMounted(loadInstrumentos)
</script>

<style scoped>
.welcome-section {
  background: linear-gradient(135deg, #ff6b6b 0%, #4ecdc4 100%);
  border-radius: 16px;
  padding: 3rem 2rem;
  color: white;
  box-shadow: 0 8px 24px rgba(255, 107, 107, 0.2);
}

.welcome-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: white;
}

.welcome-subtitle {
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
}

.section-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #2d3436;
  border-bottom: 3px solid #ff6b6b;
  padding-bottom: 0.5rem;
  display: inline-block;
}

.carousel-custom {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

.carousel-custom .carousel-item {
  padding: 2rem 1rem;
  background: white;
}

.carousel-custom .product-card {
  border: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.carousel-custom .carousel-control-prev,
.carousel-custom .carousel-control-next {
  width: 50px;
  height: 50px;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 107, 107, 0.8);
  border-radius: 50%;
  opacity: 1;
  transition: background 0.3s ease;
  pointer-events: auto;
  cursor: pointer;
  border: none;
  z-index: 10;
}

.carousel-custom .carousel-control-prev:hover,
.carousel-custom .carousel-control-next:hover {
  background: #ff6b6b;
  opacity: 1;
}

.carousel-custom .carousel-control-prev:focus,
.carousel-custom .carousel-control-next:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(255, 107, 107, 0.5);
}

.carousel-custom .carousel-control-prev-icon,
.carousel-custom .carousel-control-next-icon {
  pointer-events: none;
}

.carousel-custom .carousel-indicators button {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.2);
  transition: background 0.3s ease;
}

.carousel-custom .carousel-indicators button.active {
  background: #ff6b6b;
}

@media (max-width: 768px) {
  .welcome-title {
    font-size: 1.75rem;
  }
  
  .welcome-subtitle {
    font-size: 0.95rem;
  }
  
  .section-title {
    font-size: 1.25rem;
  }
}
</style>
