<script setup>
import { ref, watch } from "vue";
import { useLayoutStore } from "@/store/layout";
import { useNotesStore } from '@/store/notes';
import { useSettingsStore } from "@/store/settings";
import { usePreferencesStore } from "@/store/preferences";
import EditNote from "@/components/EditNote.vue";
import EditEssay from "@/components/EditEssay.vue";
import Annotations from "@/components/Annotations.vue";

const layoutStore = useLayoutStore();
const notesStore = useNotesStore();
const settingsStore = useSettingsStore();
const preferencesStore = usePreferencesStore();

const selectedEditor = ref('essay');
updateSelectedEditor();

function updateSelectedEditor() {
  switch (layoutStore.rightContent) {
    case 'annotations':
      selectedEditor.value = 'annotations';
      break
    case 'essay':
      selectedEditor.value = 'essay';
      break;
    case 'notes':
      selectedEditor.value = notesStore.activeKey;
      break;
  }
}

watch(() => layoutStore.rightContent, updateSelectedEditor);
watch(() => notesStore.activeKey, updateSelectedEditor);

function selectEditor() {

  switch (selectedEditor.value) {

    case undefined:
      updateSelectedEditor();
      break;

    case 'annotations':
      layoutStore.showAnnotations();
      break;

    case 'essay':
      layoutStore.showEssay();
      break;

    default:
      layoutStore.showNotes();
      notesStore.activeKey = selectedEditor.value;
      break;
  }
}

</script>


<template>
  <div id="app-edit-select-wrapper">
    <div class="appEditChoices">
      <v-btn-toggle v-if="settingsStore.hasNotes" density="comfortable" variant="outlined" divided
                    v-model="selectedEditor" @click="selectEditor()">
        <v-btn aria-labelledby="app-edit-select-annotations" size="small"
               value="annotations">
          <v-icon icon="mdi-marker"></v-icon>
          <span class="sr-only" id="app-edit-select-annotations">Anmerkungen</span>
          <span aria-hidden="true">Anmerkungen</span>
        </v-btn>
        <v-btn aria-labelledby="app-edit-select-text" size="small"
               value="essay">
          <v-icon icon="mdi-file-edit-outline"></v-icon>
          <span class="sr-only" id="app-edit-select-text">Abgabe Text bearbeiten</span>
          <span aria-hidden="true">Text</span>
        </v-btn>
        <v-btn size="small"
               v-for="key in notesStore.keys"
               :aria-labelledby="'app-edit-select-note' + notesStore.notes[key].note_no"
               :key="key"
               :value="key">
          <v-icon icon="mdi-clipboard-outline"></v-icon>
          <span class="sr-only"
                :id="'app-edit-select-note' + notesStore.notes[key].note_no">{{ settingsStore.notice_boards == 1 ? 'Notizen bearbeiten' : 'Notiz ' + (notesStore.notes[key].note_no + 1) + ' bearbeiten' }}</span>
          <span
              aria-hidden="true">{{ settingsStore.notice_boards == 1 ? 'Notizen' : notesStore.notes[key].note_no + 1 }}</span>
        </v-btn>
      </v-btn-toggle>
      <span aria-hidden="true" v-if="settingsStore.hasNotes">&nbsp;</span>
      <v-btn-group density="comfortable" variant="outlined" divided>
        <v-btn title="Editor Text verkleinern" size="small" icon="mdi-magnify-minus-outline"
               @click="preferencesStore.zoomEditorOut()"></v-btn>
        <v-btn title="Editor Text vergrößern" size="small" icon="mdi-magnify-plus-outline"
               @click="preferencesStore.zoomEditorIn()"></v-btn>
        <v-btn
            :title="preferencesStore.word_count_enabled ? 'Zähler verbergen' : 'Zähler anzeigen'" size="small"
            :icon="preferencesStore.word_count_enabled ? 'mdi-numeric' : 'mdi-numeric-off'"
            @click="preferencesStore.toggleWordCountEnabled()">
        </v-btn>
      </v-btn-group>
    </div>
    <div class="appEditors">
      <!-- Ally: use v-show to keep cursor at position when only one columns is shown and columns are switched -->
      <annotations v-show="layoutStore.isAnnotationsSelected"></annotations>
      <edit-essay v-show="layoutStore.isEssaySelected"/>
      <edit-note
          v-if="settingsStore.notice_boards > 0"
          v-show="layoutStore.isNotesSelected && notesStore.activeKey == key"
          v-for="key in notesStore.keys"
          :key="key"
          :noteKey="key"
          :noteLabel="settingsStore.notice_boards == 1 ? 'Notizen' : 'Notiz ' + (notesStore.notes[key].note_no + 1)"
      >
      </edit-note>
    </div>

  </div>
</template>


<style scoped>

#app-edit-select-wrapper {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.appEditChoices {
  text-align: center;
  padding-bottom: 5px;
}

.appEditors {
  flex-grow: 1;
}
</style>
