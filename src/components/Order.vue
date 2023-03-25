<script setup lang="ts">
import { ref, onMounted } from "vue"
import { IOrder } from "../contracts/IOrder"

const API = ref(import.meta.env.VITE_API_URL);
const orders = ref<IOrder[]>([])
const def_order_status = ["PENDING", "Approved", "Denied"]
const dialogControl = ref(false)


const servers = ["SEA", "CN"]
const selectedServer = ref("SEA")

const targetModel = ref<IOrder | null>(null);

const getOrders = () => {
    fetch(`${API.value}/orders`, {
        method: "POST",
        mode: "cors",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            adKey: import.meta.env.VITE_ADMIN_KEY,
            page: 1,
            status: -1,
            uid: "",
            payment_method: "",
            remarks: "",
            amount: 0,
            server: selectedServer.value

        })
    })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                orders.value = data.data.orders
            }
        })
}

const openDialog = (control: boolean, model: IOrder | null) => {
    targetModel.value = model
    dialogControl.value = control
}

onMounted(() => {
    getOrders()
})
</script>
<template>
    <v-container fluid>
        <v-row>
            <v-col cols="4">
                <v-select v-model="selectedServer" :items="servers" label="Select Server" class="mx-auto"
                    @update:model-value="getOrders" />
            </v-col>
        </v-row>

        <v-row>
            <v-col cols="12">
                <v-table fixed-header>
                    <thead>
                        <tr>
                            <th class="text-left">Date</th>
                            <th class="text-left">Order</th>
                            <th class="text-left">Status</th>
                            <th class="text-left">Remarks</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="order in orders" :key="order._id">
                            <td>{{ order.createdAt }}</td>
                            <td><v-btn color="green-darken-4" @click="openDialog(true, order)">{{ order.amount }} pts</v-btn></td>
                            <td>{{ def_order_status[order.orderStatus] }}</td>
                            <td>{{ order.remarks }}</td>
                        </tr>
                    </tbody>
                </v-table>
            </v-col>
        </v-row>
    </v-container>

    <v-dialog v-model="dialogControl">
        <v-card>
            <v-card-title class="text-h4 py-3">Order <b>{{ targetModel?.amount }} pts</b></v-card-title>
            <v-divider></v-divider>
            <v-card-text>
                <v-btn color="blue">Approve Order</v-btn>
                <v-btn color="red" class="ml-3">Deny Order</v-btn> 
                <v-btn color="yellow" class="ml-3" @click="openDialog(false, null)">Close Dialog</v-btn>
                <v-list>
                    <v-list-item class="my-2">
                        <v-list-item-title>{{ targetModel?.account }}</v-list-item-title>
                        <v-list-item-subtitle>Username</v-list-item-subtitle>
                    </v-list-item>
                    <v-list-item class="my-2">
                        <v-list-item-title>{{ targetModel?.uid }}</v-list-item-title>
                        <v-list-item-subtitle>UID</v-list-item-subtitle>
                    </v-list-item>
                    <v-list-item class="my-2">
                        <v-list-item-title>{{ targetModel?.server }}</v-list-item-title>
                        <v-list-item-subtitle>Server</v-list-item-subtitle>
                    </v-list-item>
                    <v-list-item class="my-2">
                        <v-list-item-title>{{ targetModel?.email }}</v-list-item-title>
                        <v-list-item-subtitle>E-mail</v-list-item-subtitle>
                    </v-list-item>
                    <v-list-item class="my-2">
                        <v-list-item-title>{{ targetModel?.payment_method }}</v-list-item-title>
                        <v-list-item-subtitle>Payment Method</v-list-item-subtitle>
                    </v-list-item>
                </v-list>

                <h3>Screenshot</h3>
                <a :href="targetModel?.image" target="_blank"><v-img :src="targetModel?.image" width="40%"></v-img></a>

            </v-card-text>
        </v-card>
    </v-dialog>
</template>