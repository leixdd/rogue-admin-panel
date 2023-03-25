import { createRouter, createWebHistory } from "vue-router";
import MainComponent from "../components/Main.vue";
import OrderComponent from "../components/Order.vue";

const routes = [
    {path: "/", component: MainComponent },
    {path: "/orders", component: OrderComponent}
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router