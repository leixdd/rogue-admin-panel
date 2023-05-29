<script setup lang="ts">
import {ref, onMounted} from "vue"
import {ITransaction} from "../contracts/ITransaction"
import { IStreamerData } from "../contracts/IStreamerData";

const API = ref(import.meta.env.VITE_API_URL);
const transactions = ref<IStreamerData[]>([])
const selectedServer = ref("SEA")
const formSearchInput = ref("")
const currentPage = ref(1);
const search = ref("");
const totalItems = ref(0);

const getStreamerCodes = () => {
    return new Promise((resolve, reject) => {
        fetch(`${API.value}/streamerCode`, {
            method: "POST",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                adKey: import.meta.env.VITE_ADMIN_KEY,
                page: currentPage.value,
                server: selectedServer.value,
                streamerCode: formSearchInput.value
            })
        })
        .then(response => response.json())
        .then(data => {

            transactions.value = data.data.streamerCodeQuerAggregate.filter((d: IStreamerData) => d.streamerCode)
        })
    })
}

onMounted(() => {
    getStreamerCodes()
})

</script>
<template>
    <v-container fluid>
        <v-row>
            <v-col cols="8">
                <v-text-field v-model="formSearchInput" placeholder="Search" hint="Search"></v-text-field>
            </v-col>
            <v-col cols="4">
                <v-btn @click="getStreamerCodes" class="btn btn-lg" size="large" color="green-darken-4">Search</v-btn>
            </v-col>

            <v-col cols="12">
                <v-table>
                    <thead>
                        <tr>
                            <th>Streamer Code</th>
                            <th>Count</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item in transactions" :key="item.streamerCode">
                            <td>{{ item.streamerCode }}</td>
                            <td>{{ item.count }}</td>
                        </tr>
                    </tbody>
                </v-table>
            </v-col>
        </v-row>
    </v-container>
</template>