import { createRouter, createWebHistory } from "vue-router";
import MainComponent from "../components/Main.vue";
import OrderComponent from "../components/Order.vue";
import MarketVue from "../components/Market.vue";

const routes = [
    {path: "/", component: MainComponent },
    {path: "/orders", component: OrderComponent},
    {path: "/market", component: MarketVue}
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router