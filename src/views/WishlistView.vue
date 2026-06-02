<template>
  <div>
    <h2 class="h4 mb-4">❤️ Mi Lista de Deseos</h2>
    <div v-if="wishlist.length" class="row g-3">
      <div class="col-md-4" v-for="item in wishlist" :key="item.id">
        <div class="card h-100">
          <img v-if="item.instrumento.images.length" :src="getMediaUrl(item.instrumento.images[0].image)" class="card-img-top" />
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">{{ item.instrumento.name }}</h5>
            <p class="text-truncate">{{ item.instrumento.description }}</p>
            <p class="fw-bold">${{ item.instrumento.price }}</p>
            <button class="btn btn-danger mt-auto" @click="removeItem(item.id)">Eliminar</button>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="alert alert-info">No hay instrumentos en la lista de deseos.</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import api, { getMediaUrl } from "../services/api";

const wishlist = ref([]);

async function loadWishlist() {
  try {
    const response = await api.get("/wishlist/");
    wishlist.value = response.data;
  } catch (error) {
    console.error(error);
  }
}

async function removeItem(id) {
  try {
    await api.delete(`/wishlist/${id}/`);
    wishlist.value = wishlist.value.filter((item) => item.id !== id);
  } catch (error) {
    alert("No se pudo eliminar el elemento.");
  }
}

onMounted(loadWishlist);
</script>
