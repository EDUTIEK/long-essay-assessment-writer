<script setup>

import {useApiStore} from "@/store/api";
import {useLayoutStore} from "@/store/layout";
import {useEssayStore} from "@/store/essay";
import {useTaskStore} from "@/store/task";
import {ref} from "vue";
import FileHandling from "@/lib/FileHandling";
import SendingResult from "@/data/SendingResult";

const apiStore = useApiStore();
const layoutStore = useLayoutStore();
const essayStore = useEssayStore();
const taskStore = useTaskStore();
const fileHandling = new FileHandling();

const showSending = ref(false);
const showFailure = ref(false);
const sendingResult = ref(new SendingResult());

async function sendUpdate() {
  showSending.value = true;
  showFailure.value = false;
  const result = await essayStore.sendUpdate(true);
  showSending.value = false;
  if (result && !result.success) {
    sendingResult.value = result;
    showFailure.value = true;
  }
}

function openPopup() {
  showSending.value = false;
  showFailure.value = false;
  sendingResult.value = new SendingResult();
  layoutStore.showSendingStatus = true;
}

function closePopup() {
  layoutStore.showSendingStatus = false;
}

async function downloadEssay() {
  const blob = new Blob([essayStore.currentContent], { type: 'text/html' });
  await fileHandling.saveFile(blob, taskStore.writer_name + '.html');
}

</script>

<template>

  <v-list tabindex="-1">
    <v-list-item
        tabindex="-1"
        @click = "openPopup()"
        :aria-label="apiStore.isSending ? 'Änderungen werden gesendet' : (apiStore.isAllSent ? 'Alles gesendet' : 'Noch Änderungen zu senden')"
        :title="apiStore.isSending ? 'Änderungen werden gesendet' : (apiStore.isAllSent ? 'Alles gesendet' : 'Noch Änderungen zu senden')"
    >
      <template v-slot:prepend>
        <v-icon aria-role="hidden"
                :icon="apiStore.isSending ? 'mdi-cloud-upload' : (apiStore.isAllSent ? 'mdi-cloud-check-outline' : 'mdi-cloud-outline')"></v-icon>
      </template>
    </v-list-item>

    <v-dialog v-model="layoutStore.showSendingStatus" max-width="1000">
      <v-card>
        <v-card-text>
          <h2>Speicherung und Übertragung</h2>

          <v-alert v-show="showSending">Übertrage...</v-alert>
          <v-alert v-show="showFailure">Beim Übertragen ist ein Fehler aufgetreten!
            <br>{{sendingResult.message}}
            <br>{{sendingResult.details}}
          </v-alert>

          <v-table>
            <tbody>
            <tr>
              <td>
                Letzte lokale Speicherung im Browser:
              </td>
              <td>
                {{essayStore.lastSave > 0 ? essayStore.formatTimestamp(essayStore.lastSave) : 'keine'}}
              </td>
            </tr>
            <tr>
              <td>
                Letzte Übertragung auf den Server:
              </td>
              <td>
                {{essayStore.lastSendingSuccess > 0 ? essayStore.formatTimestamp(essayStore.lastSendingSuccess) : 'keine'}}
              </td>
            </tr>
            <tr>
              <td>
                Bearbeitungsschritte:
              </td>
              <td>
                {{essayStore.openSendings > 0 ? (essayStore.openSendings  + ' noch nicht übertragen') : 'alle übertragen' }}
              </td>
            </tr>
            </tbody>
          </v-table>
        </v-card-text>
        <v-card-actions>
          <v-btn @click="sendUpdate()">
            <v-icon left icon="mdi-file-send-outline"></v-icon>
            <span>Übertragen</span>
          </v-btn>
          <v-btn @click="downloadEssay()">
            <v-icon left icon="mdi-file-download-outline"></v-icon>
            <span>Exportieren</span>
          </v-btn>
          <v-btn @click="closePopup()">
            <v-icon left icon="mdi-close"></v-icon>
            <span>Schließen</span>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </v-list>

</template>

<style scoped>

</style>