<script setup>

/**
 * Main Application
 */
import { watch } from 'vue';
import AppBar from "@/components/AppBar.vue";
import NavBar from "@/components/NavBar.vue";
import MainContent from "@/components/MainContent.vue";
import StartupContent from "@/components/StartupContent.vue";
import ReviewContent from "@/components/ReviewContent.vue";
import {useApiStore} from '@/store/api';

const apiStore = useApiStore();
apiStore.init();

</script>

<template>
    <v-app fill-height>
      <startup-content v-if="!apiStore.initialized" />
      <app-bar v-if="apiStore.initialized"/>
      <nav-bar v-if="apiStore.initialized && !apiStore.review"/>
      <main-content v-if="apiStore.initialized && !apiStore.review"/>
      <review-content v-if="apiStore.initialized && apiStore.review"/>
    </v-app>
</template>

<style>

/**
 * Global content styles will be applied by class
 */
@import '@/styles/content.css';
@import '@/styles/headlines-single.css';
@import '@/styles/headlines-three.css';
@import '@/styles/headlines-numeric.css';
@import '@/styles/headlines-edutiek.css';


html {
  overflow-y: hidden !important;
}


/* needed to avoid highlight of selected NavBar item, must be global */
.v-list-item__overlay {
  visibility: hidden !important;
}

.v-navigation-drawer__content {
  background-color: #fafafa;
}


</style>
