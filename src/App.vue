<script setup lang="ts">

import { ref } from "vue"

const navControl = ref(true)

const routes = [
  {name: "Home", path: "/"},
  {name: "Orders", path: "/orders"},
  {name: "Market", path: "/market"},
  {name: "Transactions", path: "/transactions"},
  {name: "Streamer Code Data", path: "/streamer-code-data"},
]
</script>

<style>
  .active-route {
    border-bottom: 2px solid green;
  }
</style>

<template>
  <v-card>
    <v-layout>
      <v-app-bar>
        <template v-slot:prepend>
          <v-app-bar-nav-icon @click="navControl = (!navControl)"></v-app-bar-nav-icon>
        </template>

        <v-app-bar-title>Rogue Admin Panel</v-app-bar-title>
      </v-app-bar>
      

      <v-navigation-drawer v-model="navControl">
        <v-list>
          <v-list-item v-for="route in routes">
            <router-link :to="route.path" class="text-decoration-none" exact-active-class="active-route">{{ route.name }}</router-link>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>

      <v-main>
        <router-view></router-view></v-main>
    </v-layout>
  </v-card>
</template>
