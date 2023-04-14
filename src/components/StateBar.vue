<script setup>
  import {useEssayStore} from '@/store/essay';
  const essayStore = useEssayStore();
</script>

<template>
  <v-app-bar location="bottom" height="48" color="grey-lighten-5" elevation="1">
      Pilot (alpha) |
      Änderungen: {{essayStore.historyLength}} |
      Zu senden: {{essayStore.openSendings}}
  </v-app-bar>
</template>

<style scoped>
  .v-toolbar {
    padding-left: 10px;
  }
</style>
