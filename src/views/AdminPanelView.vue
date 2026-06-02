<template>
  <div>
    <h2 class="h4 mb-4">Panel de Administración</h2>
    <div class="row g-4">
      <div class="col-md-6">
        <div class="card p-3">
          <h5>Tipos de Instrumento</h5>
          <form class="mb-3" @submit.prevent="createCategory">
            <div class="input-group">
              <input v-model="newCategory" class="form-control" placeholder="Nueva categoría" required />
              <button class="btn btn-primary" type="submit">Crear</button>
            </div>
          </form>
          <ul class="list-group">
            <li class="list-group-item" v-for="category in categories" :key="category.id">
              {{ category.name }}
            </li>
          </ul>
        </div>
      </div>
      <div class="col-md-6">
        <div class="card p-3">
          <h5>Instrumentos</h5>
          <form @submit.prevent="createProduct">
            <div class="mb-2">
              <input v-model="productData.name" class="form-control" placeholder="Nombre del instrumento" required />
            </div>
            <div class="mb-2">
              <select v-model="productData.category" class="form-select" required>
                <option value="" disabled>Seleccione categoría</option>
                <option v-for="category in categories" :key="category.id" :value="category.id">{{ category.name }}</option>
              </select>
            </div>
            <div class="mb-2">
              <input v-model="productData.price" type="number" class="form-control" placeholder="Precio" required />
            </div>
            <div class="mb-2">
              <input v-model="productData.stock" type="number" class="form-control" placeholder="Stock" required />
            </div>
            <div class="mb-2">
              <textarea v-model="productData.description" class="form-control" rows="2" placeholder="Descripción"></textarea>
            </div>
            <button class="btn btn-success" type="submit">Crear instrumento</button>
          </form>
          <hr />
          <h6 class="mt-3">Instrumentos existentes</h6>
          <div v-if="instruments.length" class="list-group mt-2">
            <div v-for="inst in instruments" :key="inst.id" class="list-group-item d-flex justify-content-between align-items-center">
              <div>
                <strong>{{ inst.name }}</strong>
                <div class="text-muted small">{{ inst.category }} · ${{ inst.price }}</div>
                <div v-if="inst.origen" class="text-muted small" style="color: #6c757d;">📍 {{ inst.origen }}</div>
              </div>
              <div class="dropdown">
                <button class="btn btn-sm btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                  Acciones
                </button>
                <ul class="dropdown-menu dropdown-menu-end">
                  <li><a class="dropdown-item" href="#" @click.prevent="openInstrument(inst)">✏️ Editar</a></li>
                  <li><a class="dropdown-item" href="#" @click.prevent="generateSample(inst)" :class="{disabled: inst.generating}">
                    <span v-if="inst.generating">⏳ Generando...</span>
                    <span v-else>🎵 Generar muestra IA</span>
                  </a></li>
                </ul>
              </div>
            </div>
          </div>
          <div v-else class="alert alert-secondary mt-2">No hay instrumentos creados aún.</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import api from "../services/api";

const categories = ref([]);
const instruments = ref([]);
const newCategory = ref("");
const productData = ref({ name: "", category: "", price: 0, stock: 0, description: "" });

async function loadCategories() {
  try {
    const response = await api.get("/tipos/");
    categories.value = response.data;
  } catch (error) {
    console.error(error);
  }
}

async function createCategory() {
  try {
    await api.post("/tipos/", { name: newCategory.value, description: "" });
    newCategory.value = "";
    loadCategories();
  } catch (error) {
    alert("Error al crear categoría.");
  }
}

async function createProduct() {
  try {
    await api.post("/instrumentos/", productData.value);
    productData.value = { name: "", category: "", price: 0, stock: 0, description: "" };
    alert("Instrumento creado exitosamente.");
    loadInstruments();
  } catch (error) {
    alert("No se pudo crear el instrumento.");
  }
}

async function loadInstruments() {
  try {
    const resp = await api.get("/instrumentos/");
    instruments.value = resp.data.map((i) => ({ ...i, generating: false }));
  } catch (e) {
    console.error(e);
  }
}

function openInstrument(inst) {
  // abrir la vista de detalle para editar mediante ruta (si existe)
  window.location.href = `/product/${inst.id}`;
}

async function generateSample(inst) {
  try {
    inst.generating = true;
    const resp = await api.post(`/instrumentos/${inst.id}/generate_audio/`, { prompt: inst.name });
    // actualizar lista
    inst.audio_sample = resp.data.audio_sample;
    inst.generating = false;
    alert('Muestra generada y guardada en el instrumento.');
  } catch (e) {
    inst.generating = false;
    console.error(e);
    alert('Error generando la muestra. Revisa la consola del servidor.');
  }
}

onMounted(() => {
  loadCategories();
  loadInstruments();
});
</script>
