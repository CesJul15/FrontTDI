<template>
  <div class="row justify-content-center">
    <div class="col-md-5">
      <div class="card p-4 shadow-sm">
        <h3 class="card-title mb-3">Ingresar a EnFA</h3>
        <form @submit.prevent="loginUser">
          <div class="mb-3">
            <label class="form-label">Usuario</label>
            <input v-model="username" class="form-control" required />
          </div>
          <div class="mb-3">
            <label class="form-label">Contraseña</label>
            <input type="password" v-model="password" class="form-control" required />
          </div>
          <button class="btn btn-primary w-100" type="submit">Entrar</button>
        </form>
        <div v-if="errorMessage" class="alert alert-danger mt-3">{{ errorMessage }}</div>
        <div class="mt-3 text-center">
          <router-link to="/register">Crear cuenta</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// ============================================================
// PÁGINA DE INICIO DE SESIÓN
// ============================================================
// Formulario para que usuarios se autentiquen
// Envía username + password al backend para obtener tokens JWT

import { ref } from "vue";
import { useRouter } from "vue-router";
import api from "../services/api";

const router = useRouter();
// Variables reactivas del formulario
const username = ref("");
const password = ref("");
const errorMessage = ref("");

// ============================================================
// FUNCIÓN DE LOGIN
// ============================================================
async function loginUser() {
  // Limpiar errores previos
  errorMessage.value = "";
  try {
    // Enviar username y password al backend
    const response = await api.post("/auth/login/", {
      username: username.value,
      password: password.value,
    });
    
    // Si login es exitoso, recibimos tokens JWT
    // access: token para peticiones autenticadas
    // refresh: token para renovar el access cuando expire
    localStorage.setItem("jwt_access", response.data.access);
    localStorage.setItem("jwt_refresh", response.data.refresh);
    
    // Obtener datos del usuario actual (rol, username, etc)
    const profile = await api.get("/auth/me/");
    // Guardar rol e información del usuario
    localStorage.setItem("user_role", profile.data.role);
    localStorage.setItem("user_name", profile.data.username);
    
    // Redirigir a la página de inicio
    router.push("/home");
  } catch (error) {
    // Manejo de errores con mensaje específico del backend
    if (error.response) {
      const detail = error.response.data?.detail || error.response.data?.message || "Credenciales incorrectas.";
      errorMessage.value = `Error ${error.response.status}: ${detail}`;
    } else if (error.request) {
      errorMessage.value = "Error de Conexion.";
    } else {
      errorMessage.value = "Error inesperado al iniciar sesión.";
    }
  }
}
</script>
