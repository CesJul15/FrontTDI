<template>
  <div>
    <!-- NavBar solo se muestra cuando no estamos en login/register -->
    <NavBar v-if="showNav" />
    <!-- Aquí se cargan las páginas según la ruta actual -->
    <main class="container mt-4">
      <router-view />
    </main>
  </div>
</template>

<script setup>
// ============================================================
// COMPONENTE RAÍZ DE LA APLICACIÓN
// ============================================================
// Este es el componente principal que envuelve toda la app
// Muestra el navbar y renderiza la página actual según la ruta

import { computed } from "vue";
import { useRoute } from "vue-router";
import NavBar from "./components/NavBar.vue";

const route = useRoute();
// Mostrar navbar en todas las rutas excepto login y register
const showNav = computed(() => !["/login", "/register"].includes(route.path));
</script>
