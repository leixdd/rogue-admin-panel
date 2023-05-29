import { createRouter, createWebHistory } from "vue-router";
import MainComponent from "../components/Main.vue";
import OrderComponent from "../components/Order.vue";
import MarketVue from "../components/Market.vue";
import TransactionsVue from "../components/Transactions.vue";
import StreamerCodeDataVue from "../components/StreamerCodeData.vue";

const routes = [
    {path: "/", component: MainComponent },
    {path: "/orders", component: OrderComponent},
    {path: "/market", component: MarketVue},
    {path: "/transactions", component: TransactionsVue},
    {path: "/streamer-code-data", component: StreamerCodeDataVue}
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router