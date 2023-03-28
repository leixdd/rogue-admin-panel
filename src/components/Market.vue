<script setup lang="ts">
import Swal from "sweetalert2";
import { ref, onMounted, watch } from "vue"
import { IItem } from "../contracts/IItem"

const API = ref(import.meta.env.VITE_API_URL);

const marketList = ref<IItem[]>([])

//serch
const searchCode = ref("")
const seeSoldItems = ref(false)

watch(seeSoldItems, (n, o) => {
    getAllItems(true)
})

//newItem
const cDialog = ref(false)
const cName = ref("");
const cDescription = ref("");
const cPrice = ref("")
const cImage = ref("")
const cCode = ref("")
const cPwd = ref("")

//updateItem
const uTargetModel = ref<IItem | null>(null)
const uDialog = ref(false)
const uName = ref("");
const uDescription = ref("");
const uPrice = ref(0)
const uImage = ref("")
const uActive = ref(false)

const getAllItems = (active: boolean) => {

    fetch(`${API.value}/market/list`, {
        method: "POST",
        mode: "cors",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            active: String(active)
        })
    })
    .then(r => r.json())
    .then(res => {
        if (res.status) {
            if(res.data) {
                marketList.value = (res.data as IItem[]).filter(item => (!item.sold ? true : (seeSoldItems.value) ))
            }
        }
    })
    .catch(err => {
        Swal.fire("error", err.message, "error")
    })

}

const createItem = () => {

    fetch(`${API.value}/market/createItem`, {
        method: "POST",
        mode: "cors",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            name: cName.value,
            description: cDescription.value,
            price: cPrice.value,
            image: cImage.value,
            code: cCode.value,
            pwd: cPwd.value
        })
    })
    .then(r => r.json())
    .then(res => {
        if (res.status) {
            cDialog.value = false
            Swal.fire("Success", res.message, "success")
            getAllItems(true)
        }
        else{
            Swal.fire("error", res.message, "error")
        }
    })
    .catch(err => {
        Swal.fire("error", err.message, "error")
    })

}

const updateItem = () => {

    fetch(`${API.value}/market/update`, {
        method: "POST",
        mode: "cors",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            name: uName.value,
            description: uDescription.value,
            price: uPrice.value,
            image: uImage.value,
            code: uTargetModel.value?.code,
            active: uActive.value
        })
    })
    .then(r => r.json())
    .then(res => {
        if (res.status) {
            openUpdateDialog(false, null)
            Swal.fire("Success", res.message, "success")
            getAllItems(true)
        }
        else{
            Swal.fire("error", res.message, "error")
        }
    })
    .catch(err => {
        Swal.fire("error", err.message, "error")
    })

}

const deleteItem = () => {
    fetch(`${API.value}/market/delete`, {
        method: "POST",
        mode: "cors",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            code: uTargetModel.value?.code,
        })
    })
    .then(r => r.json())
    .then(res => {
        if (res.status) {
            openUpdateDialog(false, null)
            Swal.fire("Success", res.message, "success")
            getAllItems(true)
        }
        else{
            Swal.fire("error", res.message, "error")
        }
    })
    .catch(err => {
        Swal.fire("error", err.message, "error")
    })
}

const openUpdateDialog = (dialog: boolean, model: IItem | null) => {

    if(model?.sold) {
        Swal.fire("Opps", "Item is already been sold", "error")
        return;
    }

    uDialog.value = dialog
    uTargetModel.value = null

    if(dialog) {
        uTargetModel.value = model
        uName.value = uTargetModel.value?.name || ""
        uDescription.value = uTargetModel.value?.description || ""
        uPrice.value = uTargetModel.value?.price || 0
        uImage.value = uTargetModel.value?.image || ""
        uActive.value = uTargetModel.value?.active || false
    }
}

const search = () => {

    if(searchCode.value === "") {
        getAllItems(true)
        return;
    }

     fetch(`${API.value}/market/search`, {
        method: "POST",
        mode: "cors",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            code: searchCode.value
        })
    })
    .then(r => r.json())
    .then(res => {
        if (res.success) {

            if(res.data) {
                marketList.value = [res.data].filter(item => (!item.sold ? true : (seeSoldItems.value) ))
                return;
            }

            marketList.value = []
            

        }
    })
    .catch(err => {
        Swal.fire("error", err.message, "error")
    })
}

const clearText = () => {
    searchCode.value = ""
    getAllItems(true)
}




onMounted(() => {
    getAllItems(true)
})

</script>

<template>
    <v-container fluid>
        <v-row>
            <v-col cols="12">
                <v-btn @click="cDialog = true" large color="green">+ Add new item</v-btn>
            </v-col>
            <v-col cols="12">
                <v-switch v-model="seeSoldItems" label="See Sold items" color="green"></v-switch>
            </v-col>
            <v-col cols="9">
                <v-text-field v-model="searchCode" large hint="Search By Code" label="Search By Code" clearable @click:clear="clearText"></v-text-field>
            </v-col>
            <v-col cols="3">
                <v-btn large @click="search" color="green">Search</v-btn>
            </v-col>
            <v-col cols="12">
                <v-table>
                    <thead>
                        <tr>
                            <td>Code</td>
                            <td>Price</td>
                            <td>Name</td>
                            <td>Description</td>
                            <td>Active</td>
                            <td>Sold</td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item in marketList" :key="item.code">
                            <td><span @click="openUpdateDialog(true, item)" :style="{color: 'cyan', textDecoration: 'underline'}">{{ item.code }}</span></td>
                            <td>{{ item.price }}</td>
                            <td>{{ item.name }}</td>
                            <td>{{ item.description }}</td>
                            <td :style="{ color: (item.active ? 'green' : 'red') }">{{ item.active ? "Listed" : "Not Listed"}}</td>
                            <td :style="{ color: (item.sold ? 'green' : 'red') }">{{ item.sold ? "Sold" : "Available"}}</td>
                        </tr>
                    </tbody>
                </v-table>
            </v-col>
        </v-row>
    </v-container>

    <v-dialog v-model="cDialog" width="500px">
        <v-card>
            <v-card-title>Add new Item</v-card-title>
            <v-card-text>
                <v-btn @click="cDialog = false" color="yellow">Close Dialog</v-btn>
                <div class="form-control">
                    <v-text-field v-model="cName" hint="Item name" label="Item Name" class="my-3"></v-text-field>
                    <v-text-field v-model="cDescription" hint="Item Description" label="Item Description" class="my-3"></v-text-field>
                    <v-text-field type="number" v-model="cPrice" hint="Item Price" label="Item Price" class="my-3"></v-text-field>
                    <v-text-field v-model="cImage" hint="Item Image" label="Item Image" class="my-3"></v-text-field>
                    <v-text-field v-model="cCode" hint="Item Code" label="Item Code" class="my-3"></v-text-field>
                    <v-text-field v-model="cPwd" hint="Item Code Password" label="Item Code Password" class="my-3"></v-text-field>
                </div>
                
                <v-btn @click="createItem" color="green">Submit</v-btn>
            </v-card-text>
        </v-card>
    </v-dialog>

    <v-dialog v-model="uDialog" width="500px">
        <v-card>
            <v-card-title>Add new Item</v-card-title>
            <v-card-text>
                <v-btn @click="deleteItem" color="red" class="mx-3">Delete Item</v-btn>
                <v-btn @click="openUpdateDialog(false, null)" color="yellow">Close Dialog</v-btn>
                <div class="form-control">
                    <v-select class="my-4" v-model="uActive" :items="([{value: true, label: 'Open to market (Listed)'}, {value: false, label: 'Remove to market (Unlisted)'}])" item-value="value" item-title="label"></v-select>
                    <v-text-field v-model="uName" hint="Item name" label="Item Name" class="my-3"></v-text-field>
                    <v-text-field v-model="uDescription" hint="Item Description" label="Item Description" class="my-3"></v-text-field>
                    <v-text-field type="number" v-model="uPrice" hint="Item Price" label="Item Price" class="my-3"></v-text-field>
                    <v-text-field v-model="uImage" hint="Item Image" label="Item Image" class="my-3"></v-text-field>
                </div>
                
                <v-btn @click="updateItem" color="green">Update</v-btn>
            </v-card-text>
        </v-card>
    </v-dialog>

</template>