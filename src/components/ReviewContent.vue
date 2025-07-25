<script setup>
import { useApiStore } from '@/store/api';
import { useTaskStore } from '@/store/task';
import { useEssayStore } from '@/store/essay';
import { useNotesStore } from '@/store/notes';
import { useSettingsStore } from '@/store/settings';
import { usePreferencesStore } from "@/store/preferences";

const apiStore = useApiStore();
const essayStore = useEssayStore();
const notesStore = useNotesStore();
const taskStore = useTaskStore();
const settingsStore = useSettingsStore();
const preferencesStore = usePreferencesStore();

</script>

<template>
  <v-main fill-height>
      <div class="column" v-show="essayStore.openSendings > 0">
        <div class="col-header bg-grey-lighten-4">
          <h2 class="text-h6" style="color:#f00000;">{{ $t('reviewContentNotYetSent') }}</h2>
          <p>{{ $t('reviewContentTryAgainLater') }}</p>
        </div>

        <div class="col-content">
          <div
              :class="'long-essay-content ' + settingsStore.contentClass"
              :style="'font-size:' + (preferencesStore.editor_zoom) + 'rem;'"
              v-html="essayStore.storedContent"
          ></div>
        </div>

        <div class="col-footer bg-grey-lighten-4">
          <v-btn class="ma-2" :color="settingsStore.primaryColorCss" @click="apiStore.retry()">
            <v-icon :color="settingsStore.primaryTextColorCss" icon="mdi-refresh"></v-icon>
            <span :style="settingsStore.primaryTextColorFullCss">{{ $t('reviewContentTryAgain') }}</span>
          </v-btn>
          <v-btn class="ma-2" @click="apiStore.review=false"
                 v-show="!taskStore.writingEndReached && !taskStore.isExcluded">
            <v-icon icon="mdi-file-edit-outline"></v-icon>
            <span>{{ $t('reviewContentContinueEditing') }}</span>
          </v-btn>
          <!--
          <v-btn class="ma-2" :href="apiStore.returnUrl">
            <v-icon left icon="mdi-logout-variant"></v-icon>
            <span>Ohne Übertragung beenden</span>
          </v-btn>
          -->
        </div>
      </div>

      <div class="column" v-show="essayStore.openSendings <= 0">
        <div class="col-header bg-grey-lighten-4" v-show="taskStore.isExcluded">
          <h2 class="text-h6">{{ $t('reviewContentExcluded')}}</h2>
          <p>{{ $t('reviewContentEditingPrevented') }}</p>
        </div>
        <div class="col-header bg-grey-lighten-4" v-show="taskStore.writingEndReached && !taskStore.isExcluded">
          <h2 class="text-h6">{{ $t('reviewContentTimeOver') }}</h2>
          <p>{{ $t('reviewContentEditingPrevented') }} {{$t('reviewContentPleaseCheckText') }} {{ $t('reviewContentYouMayScroll') }}
            <span v-if="notesStore.hasWrittenNotes">{{ $t('reviewContentNotesWillBePurged')}}</span></p>
        </div>
        <div class="col-header bg-grey-lighten-4" v-show="!taskStore.writingEndReached && !taskStore.isExcluded">
          <h2 class="text-h6">{{ $t('allEssay') }}</h2>
          <p>{{$t('reviewContentPleaseCheckText') }} {{ $t('reviewContentYouMayScroll') }}
            <span v-if="notesStore.hasWrittenNotes">{{ $t('reviewContentNotesWillBePurged')}}</span>
            {{ $t('reviewContentAuthorizationFinishes') }}</p>
        </div>

        <div class="col-content">
          <div
              :class="'long-essay-content ' + settingsStore.contentClass"
              :style="'font-size:' + (preferencesStore.editor_zoom * 16) + 'px;'"
              v-html="essayStore.storedContent"
          ></div>
        </div>

        <div class="col-footer bg-grey-lighten-4">
          <v-btn class="ma-2 primary" @click="apiStore.finalize(true)" :color="settingsStore.primaryColorCss"
                 v-show="!taskStore.isExcluded">
            <v-icon :color="settingsStore.primaryTextColorCss" icon="mdi-file-send-outline"></v-icon>
            <span :style="settingsStore.primaryTextColorFullCss">{{ $t('reviewContentAuthorize') }}</span>
          </v-btn>
          <v-btn class="ma-2" @click="apiStore.finalize(false)"
                 v-show="taskStore.writingEndReached || taskStore.isExcluded">
            <v-icon icon="mdi-logout-variant"></v-icon>
            <span>{{ $t('reviewContentDontAuthorize') }}</span>
          </v-btn>
          <v-btn class="ma-2" @click="apiStore.review=false"
                 v-show="!taskStore.writingEndReached && !taskStore.isExcluded">
            <v-icon icon="mdi-file-edit-outline"></v-icon>
            <span>{{ $t('reviewContentContinueEditing') }}</span>
          </v-btn>
        </div>
      </div>

    <v-dialog persistent v-model="apiStore.showFinalizeFailure">
      <v-card>
        <v-card-text>
          <p>{{ $t('reviewContentNetworkProblem') }}</p>
          <p><br>{{ $t('reviewContentLeaveAndTryLater')}}</p>
          <p v-show="apiStore.showAuthorizeFailure"><br>
            {{ $t('reviewContentCallSupervisionToAuthorize') }}
          </p>
          <p v-show="!apiStore.showAuthorizeFailure"><br>
            {{ $t('reviewContentCallSupervisionForHelp') }}
          </p>
        </v-card-text>
        <v-card-actions>
          <v-btn @click="apiStore.showFinalizeFailure=false">
            <v-icon left icon="mdi-close"></v-icon>
            <span>{{ $t('allCloseMessage') }}</span>
          </v-btn>
          <v-btn :href="apiStore.returnUrl">
            <v-icon left icon="mdi-logout-variant"></v-icon>
            <span>{{ $t('reviewContentLeaveWithoutSending') }}</span>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </v-main>
</template>

<style scoped>

/* Structure */

.column {
  position: fixed;
  height: calc((100% - 50px));
  width: 100%;
  display: flex;
  flex-direction: column;
}

.col-header {
  padding: 10px;
  padding-left: 20px;
}

.col-content {
  flex-grow: 1;
  height: calc(100% - 200px);
  background-color: white;
  overflow-y: scroll;
  padding: 10px;
  padding-left: 20px;
  font-family: Serif;
}

.col-footer {
  padding: 20px;
  background-color: lightgray;
}

.review-text, p {
  max-width: 60em;
}


</style>
