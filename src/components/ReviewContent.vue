<script setup>
import {useApiStore} from '@/store/api';
import {useTaskStore} from '@/store/task';
import {useEssayStore} from '@/store/essay';
import {useNotesStore} from '@/store/notes';
import {useSettingsStore} from '@/store/settings';
import {usePreferencesStore} from "@/store/preferences";

const apiStore = useApiStore();
const essayStore = useEssayStore();
const notesStore = useNotesStore();
const taskStore = useTaskStore();
const settingsStore = useSettingsStore();
const preferencesStore = usePreferencesStore();

</script>

<template>
  <v-main fill-height>
    <div class="container">

      <div  class="column" v-show="essayStore.openSendings > 0">
        <div class="col-header bg-grey-lighten-4">
          <h2 class="text-h6" style="color:#f00000;">Ihre letzten Eingaben wurden noch nicht übertragen, sind aber lokal gesichert!</h2>
          <p>Bitte versuchen Sie die Übertragung nach einer Minute erneut. Wenden Sie sich gegebenenfalls an die Aufsicht.</p>
        </div>

        <div class="col-content">
          <div
            :class="'long-essay-content ' + settingsStore.contentClass"
            :style="'font-size:' + (preferencesStore.editor_zoom) + 'rem;'"
            v-html="essayStore.storedContent"
          ></div>
        </div>

        <div class="col-footer bg-grey-lighten-4" >
          <v-btn class="ma-2" :color="settingsStore.primaryColorCss" @click="apiStore.retry()">
            <v-icon :color="settingsStore.primaryTextColorCss" icon="mdi-refresh" ></v-icon>
            <span :style="settingsStore.primaryTextColorFullCss">Erneut versuchen</span>
          </v-btn>
          <v-btn class="ma-2" @click="apiStore.review=false" v-show="!taskStore.writingEndReached && !taskStore.isExcluded">
            <v-icon icon="mdi-file-edit-outline"></v-icon>
            <span>Weiter bearbeiten</span>
          </v-btn>
          <!--
          <v-btn class="ma-2" :href="apiStore.returnUrl">
            <v-icon left icon="mdi-logout-variant"></v-icon>
            <span>Ohne Übertragung beenden</span>
          </v-btn>
          -->
        </div>
      </div>

      <div  class="column" v-show="essayStore.openSendings <= 0">
        <div class="col-header bg-grey-lighten-4" v-show="taskStore.isExcluded">
          <h2 class="text-h6">Sie wurden von der Bearbeitung ausgeschlossen.</h2>
          <p>Es ist keine weitere Eingabe möglich.</p>
        </div>
        <div class="col-header bg-grey-lighten-4" v-show="taskStore.writingEndReached && !taskStore.isExcluded">
          <h2 class="text-h6">Ihre Bearbeitungszeit ist beendet</h2>
          <p>Es ist keine weitere Eingabe möglich. Bitte überprüfen Sie, ob Sie den Text in dieser Form zur Bewertung abgeben möchten.
            <span v-if="notesStore.hasWrittenNotes">Ihre Notizen werden verworfen.</span></p>
        </div>
        <div class="col-header bg-grey-lighten-4" v-show="!taskStore.writingEndReached && !taskStore.isExcluded">
          <h2 class="text-h6">Abgabe-Text</h2>
          <p>Bitte überprüfen Sie, ob Sie den Text in dieser Form zur Bewertung abgeben möchten.
            <span v-if="notesStore.hasWrittenNotes">Ihre Notizen werden verworfen. Falls Teile davon bewertet werden sollen, kopieren Sie sie bitte in den Abgabetext.</span>
            Nach der Abgabe ist keine weitere Bearbeitung mehr möglich!</p>
        </div>

        <div class="col-content">
          <div
            :class="'long-essay-content ' + settingsStore.contentClass"
            :style="'font-size:' + (preferencesStore.editor_zoom * 16) + 'px;'"
            v-html="essayStore.storedContent"
          ></div>
        </div>

        <div class="col-footer bg-grey-lighten-4" >
          <v-btn class="ma-2 primary" @click="apiStore.finalize(true)" :color="settingsStore.primaryColorCss" v-show="!taskStore.isExcluded">
            <v-icon :color="settingsStore.primaryTextColorCss" icon="mdi-file-send-outline"></v-icon>
            <span :style="settingsStore.primaryTextColorFullCss">Zur Bewertung abgeben</span>
          </v-btn>
          <v-btn class="ma-2" @click="apiStore.finalize(false)" v-show="taskStore.writingEndReached || taskStore.isExcluded">
            <v-icon icon="mdi-logout-variant"></v-icon>
            <span>Meine Bearbeitung nicht bewerten</span>
          </v-btn>
          <v-btn class="ma-2" @click="apiStore.review=false" v-show="!taskStore.writingEndReached && !taskStore.isExcluded">
            <v-icon icon="mdi-file-edit-outline"></v-icon>
            <span>Weiter bearbeiten</span>
          </v-btn>
        </div>
      </div>
    </div>

    <v-dialog persistent v-model="apiStore.showFinalizeFailure">
      <v-card>
        <v-card-text>
          <p>Bei der Übertragung ihres Texts ist ein Netzwerkproblem aufgetreten. Ihre Eingaben sind lokal gesichert.</p>
          <p><br>
            Sie können die Klausur auch ohne Übertragung verlassen und später wieder aufrufen, um die Übertragung nachzuholen.
          </p>
          <p v-show="apiStore.showAuthorizeFailure"><br>
            Melden Sie sich bei der Aufsicht, um Ihre Klausur zur Korrektur abzugeben.
          </p>
          <p v-show="!apiStore.showAuthorizeFailure"><br>
            Melden Sie sich bei der Aufsicht, um Hilfe zu  erhalten.
          </p>
        </v-card-text>
        <v-card-actions>
          <v-btn @click="apiStore.showFinalizeFailure=false">
            <v-icon left icon="mdi-close"></v-icon>
            <span>Meldung schließen</span>
          </v-btn>
          <v-btn :href="apiStore.returnUrl">
            <v-icon left icon="mdi-logout-variant"></v-icon>
            <span>Ohne Übertragung verlassen</span>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </v-main>
</template>

<style scoped>

/* Structure */

.container {
  position: fixed;
  height: calc((100% - 50px));
  width: 100%;
  display: flex;
}

.column {
  flex: 1;
}

.col-header {
  height: 100px;
  width: 100%;
  padding: 10px;
  padding-left: 20px;
}

.col-content {
  height: calc(100% - 200px);
  background-color: white;
  overflow-y: scroll;
  width: 100%;
  padding:10px;
  padding-left: 20px;
  font-family: Serif;
}

.col-footer {
  position: fixed;
  height: 100px;
  bottom: 0;
  padding:20px;
  width: 100%;
  background-color: lightgray;
}

.review-text, p {
  max-width:60em;
}


</style>
