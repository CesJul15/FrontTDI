<template>
  <nav class="navbar navbar-expand-lg navbar-light enfa-navbar sticky-top">
    <div class="container-fluid">
      <router-link class="navbar-brand d-flex align-items-center" to="/home">
        <img :src="logoUrl" alt="EnFA logo" class="brand-logo me-2" />
        <span>EnFA</span>
      </router-link>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarContent">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarContent">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0 align-items-center">
          <li class="nav-item">
            <router-link class="nav-link" to="/home">
              <i class="bi bi-house-fill me-1"></i>Home
            </router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/tipos">
              <i class="bi bi-list-ul me-1"></i>Instrumentos
            </router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/wishlist">
              <i class="bi bi-heart-fill me-1"></i>Lista De Deseos
              <span v-if="wishlistCount > 0" class="badge bg-danger ms-1">{{ wishlistCount }}</span>
            </router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/cart">
              <i class="bi bi-cart-fill me-1"></i>Carrito
              <span v-if="cartCount > 0" class="badge bg-danger ms-1">{{ cartCount }}</span>
            </router-link>
          </li>
          <li class="nav-item" v-if="isAdmin">
            <router-link class="nav-link admin-link" to="/admin">
              <i class="bi bi-speedometer2 me-1"></i>Admin
            </router-link>
          </li>
        </ul>
        <form class="d-flex me-3 search-form" @submit.prevent="onSearch">
          <input v-model="search" class="form-control form-control-sm me-2" placeholder="Buscar instrumento..." />
          <button class="btn btn-primary btn-sm" type="submit">
            <i class="bi bi-search"></i>
          </button>
        </form>
        <div class="d-flex align-items-center gap-2">
          <span class="user-name">👤 {{ username }}</span>
          <button class="btn btn-danger btn-sm" @click="logout">
            <i class="bi bi-box-arrow-right me-1"></i>Salir
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import api from "../services/api";
import { getItemCount } from "../services/cart";
import logo from "../assets/logo.png";

const router = useRouter();
const search = ref("");
const cartCount = ref(getItemCount());
const wishlistCount = ref(0);
const logoUrl = logo;
const username = computed(() => localStorage.getItem("user_name") || "Usuario");
const isAdmin = computed(() => localStorage.getItem("user_role") === "admin");

function logout() {
  localStorage.removeItem("jwt_access");
  localStorage.removeItem("jwt_refresh");
  localStorage.removeItem("user_role");
  localStorage.removeItem("user_name");
  router.push("/login");
}

function onSearch() {
  if (search.value.trim()) {
    router.push({ path: "/home", query: { search: search.value } });
  }
}

function refreshCartCount() {
  cartCount.value = getItemCount();
}

window.addEventListener("cartUpdated", refreshCartCount);

onMounted(() => {
  refreshCartCount();
});
</script>

<style scoped>
.navbar-brand {
  font-size: 1.5rem;
  font-weight: 700;
  color: #ff6b6b !important;
  transition: transform 0.3s ease;
}

.navbar-brand:hover {
  transform: scale(1.05);
}

.brand-logo {
  width: 36px;
  height: 36px;
  object-fit: contain;
}

.nav-link {
  font-weight: 500;
  margin: 0 0.25rem;
  transition: all 0.3s ease;
  border-radius: 6px;
  padding: 0.5rem 0.75rem !important;
}

.nav-link:hover {
  background: rgba(255, 107, 107, 0.1);
  color: #ff6b6b !important;
}

.nav-link.admin-link {
  background: rgba(255, 107, 107, 0.15);
  color: #ff6b6b !important;
}

.search-form {
  max-width: 300px;
}

.search-form .form-control {
  border-radius: 8px;
  border: 2px solid #e9ecef;
}

.search-form .form-control:focus {
  border-color: #ff6b6b;
}

.user-name {
  font-weight: 500;
  color: #2d3436;
  white-space: nowrap;
}

@media (max-width: 992px) {
  .search-form {
    max-width: none;
    margin-bottom: 1rem;
  }
  
  .user-name {
    display: none;
  }
}
</style>
