<script setup>
  import {ref} from "vue";
  import {useLayoutStore} from "@/store/layout";
  import {useNotesStore} from '@/store/notes';
  import {useSettingsStore} from "@/store/settings";
  import EditNote from "@/components/EditNote.vue";
  import EditEssay from "@/components/EditEssay.vue";

  const layoutStore = useLayoutStore();
  const notesStore = useNotesStore();
  const settingsStore = useSettingsStore();

  const selectedEditor = ref('essay');


  function selectEditor() {

    switch (selectedEditor.value) {
      case 'essay':
        layoutStore.showEssay();
        break;

      default:
        layoutStore.showNotes();
        notesStore.activeKey=selectedEditor.value;
        break;
    }
  }

</script>


<template>
 <div id="app-edit-select-wrapper">
   <div class="appEditChoices" v-if="settingsStore.notice_boards > 0">
     <v-btn-toggle density="comfortable" variant="outlined" divided v-model="selectedEditor" @click="selectEditor()">
       <v-btn size="small"
              value="essay">
         <v-icon icon="mdi-file-edit-outline"></v-icon>
         Abgabe
       </v-btn>
       <v-btn size="small"
              v-for="key in notesStore.keys"
              :key="key"
              :value="key">
         <v-icon icon="mdi-clipboard-outline"></v-icon>
         {{notesStore.notes[key].note_no + 1}}
       </v-btn>
     </v-btn-toggle>
   </div>
   <div class="appEditors">
     <edit-essay v-show="layoutStore.isEssaySelected" />
     <edit-note
       v-if="settingsStore.notice_boards > 0"
       v-show="layoutStore.isNotesSelected && notesStore.activeKey == key"
       v-for="key in notesStore.keys"
       :key="key"
       :noteKey="key">
     </edit-note>

   </div>

 </div>
</template>


<style scoped>

#app-edit-select-wrapper {
  height:100%;
  display: flex;
  flex-direction: column;
}

.appEditChoices {
  height: 50px;
}

.appEditors {
  flex-grow: 1;
}
</style>
