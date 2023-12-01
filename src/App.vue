<script setup>

/**
 * Main Application
 */
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

html {
  overflow-y: hidden !important;
}

/* hide the statusbar from tiny editor */

.tox-statusbar {
  display: none!important;
}

/* Make font sizes in the tiny menu independent from changing font sizes in the content area */
.tox-menu p {
  font-size:16px!important;
}
.tox-menu h1 {
  font-size:32px!important;
}
.tox-menu h2 {
  font-size:18px!important;
}
.tox-menu h3 {
  font-size:16px!important;
}
.tox-menu h4 {
  font-size:14px!important;
}
.tox-menu h5 {
  font-size:13px!important;
}
.tox-menu h6 {
  font-size:12px!important;
}
.tox-menu pre {
  font-size:16px!important;
}

/* needed for instructions and review screen, must be global */
.col-content li {
  margin-left: 20px;
  margin-bottom: 5px;
}

.col-content p {
  margin-bottom: 10px;
}

/* needed to avoid highlight of selected NavBar item, must be global */
.v-list-item__overlay {
  visibility: hidden !important;
}

.v-navigation-drawer__content {
  background-color: #fafafa;
}


</style>
