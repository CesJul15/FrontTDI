<template>
  <div class="filters-sidebar card p-3">
    <h5 class="mb-3">Filtrar</h5>

    <div class="mb-3">
      <label class="form-label">Categoría</label>
      <select class="form-select" v-model="selectedCategory">
        <option value="">Todas</option>
        <option v-for="c in categorias" :key="c.id" :value="c.id">{{ c.name }}</option>
      </select>
    </div>

    <div class="mb-3">
      <label class="form-label">Precio</label>
      <div class="d-flex gap-2">
        <input type="number" class="form-control" placeholder="Min" v-model.number="priceMin" />
        <input type="number" class="form-control" placeholder="Max" v-model.number="priceMax" />
      </div>
    </div>

    <div class="mb-3">
      <label class="form-label">Ordenar</label>
      <select class="form-select" v-model="ordering">
        <option value="">Por defecto</option>
        <option value="popular">Popular</option>
        <option value="rating">Mejor valorados</option>
        <option value="price_asc">Precio: menor a mayor</option>
        <option value="price_desc">Precio: mayor a menor</option>
        <option value="newest">Más nuevos</option>
      </select>
    </div>

    <div class="d-grid">
      <button class="btn btn-primary" @click="applyFilters">Aplicar</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '../services/api'

const emit = defineEmits(['filters-changed'])

const selectedCategory = ref('')
const priceMin = ref(null)
const priceMax = ref(null)
const ordering = ref('')
const categorias = ref([])

async function loadCategorias() {
  try {
    const resp = await api.get('/tipos/')
    categorias.value = resp.data
  } catch (e) {
    console.error('Error cargando categorías:', e)
  }
}

function applyFilters() {
  const payload = {
    category: selectedCategory.value || undefined,
    price_min: priceMin.value || undefined,
    price_max: priceMax.value || undefined,
    ordering: ordering.value || undefined,
  }
  // Emit only defined keys
  const filters = {}
  Object.keys(payload).forEach(k => {
    if (payload[k] !== undefined) filters[k] = payload[k]
  })
  // Emit event
  emit('filters-changed', filters)
}

onMounted(loadCategorias)
</script>

<style scoped>
.filters-sidebar {
  border-radius: 12px;
  transition: box-shadow 0.25s ease, transform 0.25s ease;
}
.filters-sidebar:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0,0,0,0.06);
}
</style>
