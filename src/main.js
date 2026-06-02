// ============================================================
// PUNTO DE ENTRADA DE LA APLICACIÓN FRONTEND (Vue.js)
// ============================================================
// Aquí se inicializa Vue 3, se cargan estilos y el router

import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
// Bootstrap 5 - CSS framework para estilos
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./styles.css";

// Crear la aplicación Vue
const app = createApp(App);
// Usar el router para navegación entre páginas
app.use(router);
// Montar la app en el elemento #app del HTML
app.mount("#app");
