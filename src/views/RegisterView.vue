<template>
  <div class="row justify-content-center">
    <div class="col-md-5">
      <div class="card p-4 shadow-sm">
        <h3 class="card-title mb-3">Registro de usuario</h3>
        <form @submit.prevent="registerUser">
          <div class="mb-3">
            <label class="form-label">Usuario</label>
            <input v-model="username" class="form-control" required />
          </div>
          <div class="mb-3">
            <label class="form-label">Email</label>
            <input type="email" v-model="email" class="form-control" required />
          </div>
          <div class="mb-3">
            <label class="form-label">Contraseña</label>
            <input type="password" v-model="password" class="form-control" required />
          </div>
          <button class="btn btn-success w-100" type="submit">Crear cuenta</button>
        </form>
        <div class="mt-3 text-center">
          <router-link to="/login">Ya tengo cuenta</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import api from "../services/api";

const router = useRouter();
const username = ref("");
const email = ref("");
const password = ref("");

async function registerUser() {
  try {
    await api.post("/auth/register/", {
      username: username.value,
      email: email.value,
      password: password.value,
    });
    alert("Cuenta creada. Ahora inicia sesión.");
    router.push("/login");
  } catch (error) {
    alert("No se pudo crear la cuenta. Verifica los datos.");
  }
}
</script>
