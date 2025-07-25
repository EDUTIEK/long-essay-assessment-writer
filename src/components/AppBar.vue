<script setup>

/**
 * AApplication bar
 */
import Timer from "@/components/Timer.vue";
import Alerts from "@/components/Alerts.vue";
import Help from "@/components/Help.vue";

import { useApiStore } from '@/store/api';
import { useTaskStore } from "../store/task";
import { useAlertStore } from '@/store/alerts';
import { useEssayStore } from '@/store/essay';
import { useLayoutStore } from '@/store/layout';
import { nextTick, watch } from 'vue';

const apiStore = useApiStore();
const taskStore = useTaskStore();
const alertStore = useAlertStore();
const essayStore = useEssayStore();
const layoutStore = useLayoutStore();

async function handleFocusChange() {
  if (layoutStore.focusTarget == 'header') {
    await nextTick();
    for (const element of document.getElementsByClassName('app-header-item')) {
      element.focus();
      break;
    }
  }
}

watch(() => layoutStore.focusChange, handleFocusChange);

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
    apiStore.review = true;
  } else {
    window.location = apiStore.returnUrl;
  }
}

async function openReview() {
  await essayStore.updateContent(false, true);
  await sleep(500);
  apiStore.review = true;
}

</script>

<template>
  <v-app-bar elevation="1" color="white" density="compact">
    <v-app-bar-title>{{ getTitle() }}</v-app-bar-title>
    <v-spacer></v-spacer>

    <help></help>
    <alerts v-if="alertStore.hasAlerts"></alerts>
    <timer v-if="taskStore.hasWritingEnd"></timer>

    <v-btn class="app-header-item" v-show="!apiStore.review" @click="closeWriter()">
      <v-icon left icon="mdi-pause"></v-icon>
      <span>{{ $t("appBarInterrupt") }}</span>
    </v-btn>

    <v-btn class="app-header-item" v-show="!apiStore.review" @click="openReview">
      <v-icon left icon="mdi-eye"></v-icon>
      <span>{{ $t("appBarReview") }}</span>
    </v-btn>

  </v-app-bar>

</template>
