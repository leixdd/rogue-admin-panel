<script setup lang="ts">
import {ref, onMounted} from "vue"
import {ITransaction} from "../contracts/ITransaction"

const API = ref(import.meta.env.VITE_API_URL);
const transactions = ref<ITransaction[]>([])

const getMarketplaceTransactions = () => {
    return new Promise((resolve, reject) => {
        fetch(`${API.value}/marketplace/transactions`, {
            method: "POST",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({})
        })
        .then(response => response.json())
        .then(data => {

            transactions.value = data.data
        })
    })
}

onMounted(() => {
    getMarketplaceTransactions()
})

</script>
<template>
    <v-container fluid>
        <v-row>
            <v-col cols="12">
                <v-table>
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Order ID</th>
                            <th>Amount</th>
                            <th>Account</th>
                            <th>Code</th>
                            <th>PWD</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item in transactions" :key="item.code">
                            <td>{{ (new Date(item.createdAt || "")).toLocaleString() }}</td>
                            <td>{{ item.orderId }}</td>
                            <td>{{ item.amount }}</td>
                            <td>{{  item.account }}</td>
                            <td>{{ item.code }}</td>
                            <td>{{ item.pwd }}</td>
                        </tr>
                    </tbody>
                </v-table>
            </v-col>
        </v-row>
    </v-container>
</template>