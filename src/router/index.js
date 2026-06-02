// ============================================================
// RUTAS DE LA APLICACIÓN (NAVEGACIÓN)
// ============================================================
// Define todas las páginas y sus protecciones de acceso

import { createRouter, createWebHistory } from "vue-router";
import LoginView from "../views/LoginView.vue";
import RegisterView from "../views/RegisterView.vue";
import HomeView from "../views/HomeView.vue";
import CategoryListView from "../views/CategoryListView.vue";
import CategoryView from "../views/CategoryView.vue";
import ProductDetailView from "../views/ProductDetailView.vue";
import CartView from "../views/CartView.vue";
import WishlistView from "../views/WishlistView.vue";
import AdminPanelView from "../views/AdminPanelView.vue";

// ============================================================
// DEFINICIÓN DE RUTAS
// ============================================================
// meta.requiresAuth: ruta protegida (requiere estar autenticado)
// meta.guest: solo para usuarios NO autenticados (login, registro)
// meta.adminOnly: solo para administradores
const routes = [
  { path: "/", redirect: "/login" },
  // Rutas públicas (sin autenticación)
  { path: "/login", component: LoginView, meta: { guest: true } },
  { path: "/register", component: RegisterView, meta: { guest: true } },
  // Rutas protegidas (requieren autenticación)
  { path: "/home", component: HomeView, meta: { requiresAuth: true } },
  { path: "/tipos", component: CategoryListView, meta: { requiresAuth: true } },
  { path: "/tipo/:id", component: CategoryView, meta: { requiresAuth: true } },
  { path: "/product/:id", component: ProductDetailView, meta: { requiresAuth: true } },
  { path: "/cart", component: CartView, meta: { requiresAuth: true } },
  { path: "/wishlist", component: WishlistView, meta: { requiresAuth: true } },
  // Ruta solo admin
  { path: "/admin", component: AdminPanelView, meta: { requiresAuth: true, adminOnly: true } },
];

// Crear el router
const router = createRouter({
  history: createWebHistory(),
  routes,
});

// ============================================================
// FUNCIONES DE VALIDACIÓN
// ============================================================
// Verificar si el usuario está autenticado (tiene token JWT)
function isAuthenticated() {
  return !!localStorage.getItem("jwt_access");
}

// Verificar si el usuario es administrador
function isAdmin() {
  return localStorage.getItem("user_role") === "admin";
}

// ============================================================
// PROTECTOR DE RUTAS
// ============================================================
// Se ejecuta antes de navegar a cualquier página
// Valida permisos: autenticación, admin, etc.
router.beforeEach((to, from, next) => {
  // Si la ruta necesita autenticación y no está autenticado
  if (to.meta.requiresAuth && !isAuthenticated()) {
    return next({ path: "/login" });
  }
  // Si es ruta de invitado y ya está autenticado
  if (to.meta.guest && isAuthenticated()) {
    return next({ path: "/home" });
  }
  // Si es ruta admin y no es admin
  if (to.meta.adminOnly && !isAdmin()) {
    return next({ path: "/home" });
  }
  // Permitir navegación
  next();
});

export default router;
