<script setup lang="ts">
import { ref, onMounted, watch } from "vue"
import { IOrder } from "../contracts/IOrder"
import Swal from "sweetalert2"

const API = ref(import.meta.env.VITE_API_URL);
const orders = ref<IOrder[]>([])
const def_order_status = ["PENDING", "APPROVED", "DENIED"]
const form_def_order_status = [{
    value: 0,
    label: "PENDING"
},
{
    value: 1,
    label: "APPROVED"
},
{
    value: 2,
    label: "DENIED"
}]


const dialogControl = ref(false)
const dialogUpdateControl = ref(false)
const isApproved = ref(false)
const totalItems = ref(0);
const currentPage = ref(1);

const formOrderStatus = ref(0)
const formOrderRemarks = ref("")
const formSearchInput = ref("")

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
            uid: formSearchInput.value,
            payment_method: formSearchInput.value,
            remarks: formSearchInput.value,
            amount: formSearchInput.value === "" ? 0 : formSearchInput.value,
            server: selectedServer.value

        })
    })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                orders.value = data.data.orders
                totalItems.value = data.data.orderCount
            }
        })
}


const updateForm = () => {
    fetch(`${API.value}/updateOrder`, {
        method: "POST",
        mode: "cors",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            id: targetModel.value?._id,
            status: formOrderStatus.value,
            remarks: formOrderRemarks.value
        })
    })
    .then(res => res.json())
        .then(data => {
            if (data.success) {
               alert("Update Successfully")
            }
        })
}


const openDialog = (control: boolean, model: IOrder | null) => {
    targetModel.value = model
    dialogControl.value = control
}

const updateDialog = (control: boolean, action: boolean) => {

    formOrderStatus.value = action ? 1 : 2

    isApproved.value = action;
    dialogUpdateControl.value = control;
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
            <v-col cols="8">
                <v-text-field v-model="formSearchInput" placeholder="Search" hint="Search"></v-text-field>
            </v-col>
            <v-col cols="4">
                <v-btn @click="getOrders" class="btn btn-lg" size="large" color="green-darken-4">Search</v-btn>
            </v-col>
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

            <v-col cols="12">
                <v-pagination
                    :length="(Math.ceil(totalItems / 50))"
                    v-model="currentPage"
                ></v-pagination>
            </v-col>
        </v-row>
    </v-container>

    <v-dialog v-model="dialogControl" persistent>
        <v-card>
            <v-card-title class="text-h4 py-3">Order <b>{{ targetModel?.amount }} pts</b></v-card-title>
            <v-divider></v-divider>
            <v-card-text>
                <v-btn color="blue" @click="updateDialog(true, true)">Approve Order</v-btn>
                <v-btn color="red" class="ml-3"  @click="updateDialog(true, false)">Deny Order</v-btn> 
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


    <v-dialog v-model="dialogUpdateControl" persistent width="500px">
        <v-card>
            <v-card-title>[{{ isApproved ? "Approve" : "Deny" }}] {{ targetModel?.account }} : {{ targetModel?.amount }} pts</v-card-title>
            <v-card-text>
                <v-btn @click="updateDialog(false, false)" color="yellow">Close Dialog</v-btn>

                <div class="my-3">
                    <label>Status</label>
                    <v-select :items="form_def_order_status" v-model="formOrderStatus" item-title="label" item-value="value"></v-select>
                </div>

                <div class="my-3">
                    <label>Remarks</label>
                    <v-textarea v-model="formOrderRemarks"></v-textarea>
                </div>

                <v-btn @click="updateForm" class="my-3" color="green">Update</v-btn>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>