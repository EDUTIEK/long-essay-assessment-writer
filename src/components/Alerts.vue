<script setup>
import { useAlertStore } from '@/store/alerts';

const alertStore = useAlertStore();
</script>

<template>
  <v-btn @click="alertStore.showAlerts()" v-show="alertStore.hasAlerts">
    <v-icon left icon="mdi-bell-outline"></v-icon>
    <span v-show="alertStore.countAlerts == 1">1 Nachricht</span>
    <span v-show="alertStore.countAlerts > 1">{{ alertStore.countAlerts }} Nachrichten</span>
  </v-btn>

  <v-dialog persistent v-model="alertStore.hasActiveAlert" max-width="1000">
    <v-card>
      <v-card-title>
        Nachricht der Aufsicht
      </v-card-title>
      <v-card-text>
        <p>{{ alertStore.activeMessage }}</p>
      </v-card-text>
      <v-card-actions>
        <v-btn @click="alertStore.hideAlert()">
          <v-icon left icon="mdi-check"></v-icon>
          <span>OK</span>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-dialog v-model="alertStore.showAllAlerts" max-width="1000">
    <v-card>
      <v-card-title>
        Nachrichten der Aufsicht
      </v-card-title>
      <v-card-text>
        <v-list-item v-for="alert in alertStore.alerts" v-bind:key="alert.key"
                     :title="alertStore.formatTimestamp(alert.time)"
                     :subtitle="alert.message">
        </v-list-item>
      </v-card-text>
      <v-card-actions>
        <v-btn @click="alertStore.hideAlert()">
          <v-icon left icon="mdi-check"></v-icon>
          <span>OK</span>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>


<style scoped>

</style>