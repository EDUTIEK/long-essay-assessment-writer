<script setup>
  import Instructions from "@/components/Instructions.vue";
  import InstructionsPdf from '@/components/InstructionsPdf.vue';
  import Resources from "@/components/Resources.vue";
  import EditSelect from "@/components/EditSelect.vue";
  import {useLayoutStore} from "../store/layout";
  import {useResourcesStore} from "../store/resources";
  import {useClipbardStore} from "@/store/clipboard";
  const layoutStore = useLayoutStore();
  const resourcesStore = useResourcesStore();
  const clipboardStore = useClipbardStore();

</script>

<template>
  <v-main fill-height>
    <div id="app-main-container">
      <div  class="column" :class="{ colExpanded: layoutStore.isLeftExpanded, colNormal: !layoutStore.isLeftExpanded}" v-show="layoutStore.isLeftVisible">
        <div class="col-header">
          <span class="headline">{{
              layoutStore.isInstructionsSelected ? 'Aufgabenstellung'
                : layoutStore.isInstructionsPdfSelected ? 'Aufgabenstellung (PDF)'
                    : layoutStore.isResourcesSelected ? resourcesStore.activeTitle : ''}}
          </span>
          <v-btn-group density="comfortable">
            <!-- expand right column -->
            <v-btn size="small" @click="layoutStore.setLeftExpanded(false)" v-show="layoutStore.isLeftExpanded">
              <v-icon icon="mdi-chevron-left"></v-icon>
              <span>{{
                  layoutStore.isEssaySelected ? 'Abgabe-Text'
                    : layoutStore.isNotesSelected ? 'Notizen' : ''
                }}
                </span>
            </v-btn>
            <!-- expand left column -->
            <v-btn size="small" @click="layoutStore.setLeftExpanded(true)" v-show="!layoutStore.isLeftExpanded">
              <span>Erweitern</span>
              <v-icon icon="mdi-chevron-right"></v-icon>
            </v-btn>

          </v-btn-group>

        </div>
        <div class="col-content">
          <instructions v-if="layoutStore.isInstructionsVisible" />
          <instructions-pdf v-if="layoutStore.isInstructionsPdfVisible" />
          <resources v-if="layoutStore.isResourcesVisible" />
        </div>
      </div>
      <div class="column" :class="{ colExpanded: layoutStore.isRightExpanded, colNormal: !layoutStore.isRightExpanded}" v-show="layoutStore.isRightVisible" >
        <div class="col-header">
          <span class="headline">{{
            layoutStore.isEssayVisible ? 'Abgabe-Text'
              : layoutStore.isNotesVisible ? 'Notizen (werden bei der Abgabe verworfen)' : ''
            }}
          </span>
          <v-btn-group density="comfortable">

            <!-- expand left column -->
            <v-btn size="small" @click="layoutStore.setRightExpanded(false)" v-show="layoutStore.isRightExpanded">
                <span> {{
                    layoutStore.isInstructionsSelected ? 'Aufgabenstellung'
                      : layoutStore.isResourcesSelected ? resourcesStore.activeTitle : ''
                  }}
                </span>
              <v-icon icon="mdi-chevron-right"></v-icon>
            </v-btn>

            <!-- expand right column -->
            <v-btn size="small" @click="layoutStore.setRightExpanded(true)" v-show="!layoutStore.isRightExpanded">
              <v-icon icon="mdi-chevron-left"></v-icon>
              <span>Erweitern</span>
            </v-btn>

          </v-btn-group>

        </div>
        <div class="col-content">
          <edit-select/>
        </div>
      </div>
    </div>

    <v-dialog width="500" persistent v-model="clipboardStore.show_warning">
      <v-card>
        <v-card-text>
          <p>Sie können nur selbst geschriebenen Text oder Teile aus der Aufgabenstellung kopieren und einfügen.</p>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="clipboardStore.hideWarning()">
            Ok
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </v-main>
</template>

<style scoped>

/* Structure */

#app-main-container {
  position: fixed;
  height: calc(100% - 50px);
  width: calc(100% - 72px);

  display: flex;
  flex-direction: row;
}

.column {
  height:100%;
  display: flex;
  flex-direction: column;
}

.col-header {
  min-height: 40px;
  width: 100%;
  padding:10px;
}

.col-content {
  flex-grow: 1;
  background-color: white;
  width: 100%;
  padding:10px;
  overflow-y: hidden;
}

.headline {
  font-weight: bold;
}

.v-btn-group {
  margin-top: -6px;
  float: right;
}

/* Dynamic Properties */

.colNormal {
  width: 50%;
}

.colExpanded {
  width: 100%;
}


</style>
