<script setup>

import {useApiStore} from "@/store/api";
import {useLayoutStore} from "@/store/layout";
import {useEssayStore} from "@/store/essay";
import {ref} from "vue";

const apiStore = useApiStore();
const layoutStore = useLayoutStore();
const essayStore = useEssayStore();

const showSending = ref(false);
const showFailure = ref(false);

async function sendUpdate() {
  showSending.value = true;
  showFailure.value = false;
  const ok = await essayStore.sendUpdate(true);
  showSending.value = false;
  if (ok) {
    layoutStore.showSendingStatus = false;
  }
  else {
    showFailure.value = true;
  }
}

</script>

<template>

  <v-list tabindex="-1">
    <v-list-item
        tabindex="-1"
        @click = "layoutStore.showSendingStatus = true"
        :aria-label="apiStore.isSending ? 'Änderungen werden gesendet' : (apiStore.isAllSent ? 'Alles gesendet' : 'Noch Änderungen zu senden')"
        :title="apiStore.isSending ? 'Änderungen werden gesendet' : (apiStore.isAllSent ? 'Alles gesendet' : 'Noch Änderungen zu senden')"
    >
      <template v-slot:prepend>
        <v-icon aria-role="hidden"
                :icon="apiStore.isSending ? 'mdi-cloud-upload' : (apiStore.isAllSent ? 'mdi-cloud-check-outline' : 'mdi-cloud-outline')"></v-icon>
      </template>
    </v-list-item>

    <v-dialog persistent v-model="layoutStore.showSendingStatus" max-width="1000">
      <v-card>
        <v-card-text>
          <h1>Speicher-Status</h1>

          <v-alert v-show="showSending">Übertrage...</v-alert>
          <v-alert v-show="showFailure">Beim Übertragen ist ein Fehler aufgetreten!</v-alert>

          <v-table>
            <tbody>
            <tr>
              <td>
                Letzte lokale Speicherung im Browser:
              </td>
              <td>
                {{essayStore.lastSave > 0 ? essayStore.formatTimestamp(essayStore.lastSave) : 'keine seit dem Öffnen'}}
              </td>
            </tr>
            <tr>
              <td>
                Letzte Übertragung auf den Server:
              </td>
              <td>
                {{essayStore.lastSending > 0 ? essayStore.formatTimestamp(essayStore.lastSending) : 'keine seit dem Öffnen'}}
              </td>
            </tr>
            <tr>
              <td>
                Noch nicht übertragene Bearbeitungsschritte:
              </td>
              <td>
                {{essayStore.openSendings }}
              </td>
            </tr>
            </tbody>
          </v-table>
        </v-card-text>
        <v-card-actions>
          <v-btn @click="sendUpdate()">
            <v-icon left icon="mdi-close"></v-icon>
            <span>Übertragen</span>
          </v-btn>
          <v-btn @click="layoutStore.showSendingStatus = false">
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