<script setup>

/**
 * AApplication bar
 */
import Timer from "@/components/Timer.vue";
import Alerts from "@/components/Alerts.vue";

import {useApiStore} from '@/store/api';
import {useTaskStore} from "../store/task";
import {useAlertStore} from '@/store/alerts';
import {useEssayStore} from '@/store/essay';

const apiStore = useApiStore();
const taskStore = useTaskStore();
const alertStore = useAlertStore();
const essayStore = useEssayStore();

function getTitle() {
  return (taskStore.writer_name == null ? '' : taskStore.writer_name + ', ') + (taskStore.title ?? '');
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function closeWriter() {
  await essayStore.updateContent(false, true);
  await sleep(500);
  if (essayStore.openSendings > 0) {
    apiStore.review=true;
  }
  else {
    window.location = apiStore.returnUrl;
  }
}

async function openReview() {
  await essayStore.updateContent(false, true);
  await sleep(500);
  apiStore.review=true;
}

</script>

<template>
  <v-app-bar elevation="1" color="white" density="compact" >
    <v-app-bar-title>{{getTitle()}}</v-app-bar-title>
    <v-spacer></v-spacer>

    <alerts v-if="alertStore.hasAlerts"></alerts>
    <timer v-if="taskStore.hasWritingEnd"></timer>

    <v-btn v-show="!apiStore.review" @click="closeWriter()">
      <v-icon left icon="mdi-pause"></v-icon>
      <span>Unterbrechen</span>
    </v-btn>

    <v-btn v-show="!apiStore.review" @click="openReview">
      <v-icon left icon="mdi-eye"></v-icon>
      <span>Vorschau zur Abgabe </span>
    </v-btn>

  </v-app-bar>

</template>
