<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h2 class="h4">🎵 Tipos de Instrumentos</h2>
        <p class="text-muted mb-0">Selecciona un tipo de instrumento para ver todos los productos relacionados.</p>
      </div>
    </div>

    <div class="row g-3">
      <div class="col-md-4" v-for="tipo in tipos" :key="tipo.id">
        <div class="card card-category h-100" @click="viewTipo(tipo.id)">
          <div class="card-body">
            <h5 class="card-title">{{ tipo.name }}</h5>
            <p v-if="tipo.parent_id" class="text-muted mb-2">Subtipo</p>
            <p class="card-text text-truncate">{{ tipo.description || "Ver instrumentos de este tipo" }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import api from "../services/api";

const tipos = ref([]);
const router = useRouter();

async function loadTipos() {
  try {
    const response = await api.get("/tipos/");
    tipos.value = response.data;
  } catch (error) {
    console.error(error);
  }
}

function viewTipo(id) {
  router.push(`/tipo/${id}`);
}

onMounted(loadTipos);
</script>
