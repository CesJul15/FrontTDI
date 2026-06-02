<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h2 class="h4">{{ tipo?.name || "Tipo de instrumento" }}</h2>
        <p v-if="tipo" class="text-muted mb-0">{{ tipo.description }}</p>
      </div>
    </div>

    <div v-if="tipo?.subtypes?.length" class="mb-4">
      <h5>Subtipos</h5>
      <div class="row g-3">
        <div class="col-md-3" v-for="sub in tipo.subtypes" :key="sub.id">
          <div class="card card-category h-100" @click="viewTipo(sub.id)">
            <div class="card-body">
              <h5 class="card-title">{{ sub.name }}</h5>
              <p class="card-text text-truncate">{{ sub.description || "Ver instrumentos" }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="row g-3">
      <div class="col-md-4" v-for="instrumento in instrumentos" :key="instrumento.id">
        <ProductCard :product="instrumento" @wishlist="addWishlist" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import api from "../services/api";
import ProductCard from "../components/ProductCard.vue";

const route = useRoute();
const router = useRouter();
const tipo = ref(null);
const instrumentos = ref([]);

async function loadTipo() {
  try {
    const response = await api.get(`/tipos/${route.params.id}/`);
    tipo.value = response.data;
  } catch (error) {
    console.error(error);
  }
}

async function loadInstrumentos() {
  try {
    const response = await api.get("/instrumentos/", { params: { category: route.params.id } });
    instrumentos.value = response.data;
  } catch (error) {
    console.error(error);
  }
}

function viewTipo(id) {
  router.push(`/tipo/${id}`);
}

async function addWishlist(id) {
  try {
    await api.post("/wishlist/", { instrumento_id: id });
    alert("Agregado a tu lista de deseos.");
  } catch (error) {
    alert("Error al agregar a lista de deseos.");
  }
}

const loadCurrentTipo = async () => {
  await loadTipo();
  await loadInstrumentos();
};

onMounted(loadCurrentTipo);

watch(
  () => route.params.id,
  async () => {
    await loadCurrentTipo();
  }
);
</script>
