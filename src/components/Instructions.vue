<script setup>
  import {useTaskStore} from '@/store/task';
  import {usePreferencesStore} from "@/store/preferences";
  const taskStore = useTaskStore();
  const preferencesStore = usePreferencesStore();
  import {onMounted} from 'vue';

  onMounted(() => {
    applyZoom();
  });

  function zoomIn() {
    preferencesStore.zoomInstructionsIn();
    applyZoom();
  }

  function zoomOut() {
    preferencesStore.zoomInstructionsOut()
    applyZoom();
  }

  function applyZoom() {
    document.getElementById('app-instructions').style.fontSize=(preferencesStore.instructions_zoom * 16) + 'px';
  }


</script>

<template>
  <div id="app-instructions-wrapper">
    <div class="appTextButtons">
      <v-btn-group density="comfortable" variant="outlined" divided>
        <v-btn size="small" icon="mdi-magnify-minus-outline" @click="zoomOut()"></v-btn>
        <v-btn size="small" icon="mdi-magnify-plus-outline" @click="zoomIn()"></v-btn>
      </v-btn-group>
    </div>
    <div id="app-instructions" v-html="taskStore.instructions"></div>
  </div>
</template>

<style scoped>

  @import '@/styles/content.css';

  #app-instructions-wrapper {
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .appTextButtons {
    text-align: center;
    padding-bottom: 5px;
    height: 50px;
  }

  #app-instructions {
    flex-grow: 1;
    width: 100%;
    padding: 20px;
    border: 1px solid #cccccc;
    overflow-y: scroll;
  }


</style>
