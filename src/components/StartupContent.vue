<script setup>
import { useApiStore } from '@/store/api';

const apiStore = useApiStore();
</script>

<template>
  <v-main fill-height>

    <v-app-bar elevation="1" color="white" density="compact">
      <p>{{ $t('startupContentLoadData') }}</p>
      <v-spacer></v-spacer>
      <v-btn :href="apiStore.returnUrl">
        <v-icon left icon="mdi-logout-variant"></v-icon>
        <span>{{ $t('allEnd') }}</span>
      </v-btn>
    </v-app-bar>

    <v-dialog persistent v-model="apiStore.showInitFailure">
      <v-card>
        <v-card-text>
          <p>{{ $t('startupContentLoadError') }}</p>
        </v-card-text>
        <v-card-actions>
          <v-btn :href="apiStore.returnUrl">
            <v-icon left icon="mdi-logout-variant"></v-icon>
            <span>{{ $t('allEnd') }}</span>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog persistent v-model="apiStore.showReplaceConfirmation">
      <v-card>
        <v-card-text>
          <p>{{ $t('startupContentOverwriteInfo') }}</p>
          <p>{{ $t('startupContentOverwriteQuestion') }}</p>
        </v-card-text>
        <v-card-actions>
          <v-btn @click="apiStore.loadDataFromBackend()">
            <v-icon left icon="mdi-reload"></v-icon>
            <span>{{ $t('allLoad') }}</span>
          </v-btn>
          <v-btn :href="apiStore.returnUrl">
            <v-icon left icon="mdi-logout-variant"></v-icon>
            <span>{{ $t('allCancel') }}</span>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog persistent v-model="apiStore.showReloadConfirmation">
      <v-card>
        <v-card-text>
          <p>{{ $t('startupContentReloadInfo')}}</p>
          <p>{{ $t('startupContentReloadQuestion') }}</p>
        </v-card-text>
        <v-card-actions>
          <v-btn @click="apiStore.loadDataFromBackend()">
            <v-icon left icon="mdi-reload"></v-icon>
            <span>{{ $t('allLoad') }}</span>
          </v-btn>
          <v-btn :href="apiStore.returnUrl">
            <v-icon left icon="mdi-logout-variant"></v-icon>
            <span>{{ $t('allCancel') }}</span>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </v-main>
</template>


<style scoped>

</style>