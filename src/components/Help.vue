<script setup>

import { ref } from 'vue';

const showHelp = ref(false);
</script>

<template>
  <v-btn @click="showHelp=true">
    <v-icon left icon="mdi-help"></v-icon>
    Hilfe
  </v-btn>

   <v-dialog v-model="showHelp">
      <v-card>
        <v-card-text>
          <h1>Navigation mit der Tastatur</h1>

          <p>Um von einem Abschnitt der Benutzeroberfläche zum nächsten zu wechseln, drücken Sie <strong>TAB</strong>.</p>
          <p>Um von einem Abschnitt der Benutzeroberfläche zum vorherigen zu wechseln, drücken Sie <strong>UMSCHALT+TAB</strong>.</p>
          <p>Um zwischen Elementen in einem Abschnitt zu wechseln, drücken Sie die entsprechende <strong>Pfeiltaste</strong>.</p>

          <h2>Navigation im Editorbereich</h2>

          <p>Drücken Sie <strong>Alt + F10</strong> um von der Texteingabe in die Symbolleiste des Editors zu wechseln.</p>
          <p>Drücken Sie <strong>ESC</strong>, um die Symbolleiste wieder zu verlassen.</p>
          <p>Die Pfeiltasten <strong>Links</strong> und <strong>Rechts</strong> wechseln zwischen Schaltflächen in der Symbolleiste.</p>
          <p>Das Popupmenü der Absatzformate öffnen Sie mit der <strong>Eingabetaste</strong>.</p>
          <p>Das Popupmenü der Absatzformate schließen Sie mit der <strong>ESC</strong>-Taste.</p>
          <p>Die Pfeiltasten <strong>Abwärts</strong> und <strong>Aufwärts</strong> wechseln zwischen Elementen im Popupmenü der Absartformate.</p>

          <h2>Tastenbefehle im Editorbereich</h2>
          <table>
            <thead>
            <tr>
              <th>Aktion</th>
              <th>Tastenkombination</th>
            </tr>
            </thead>
            <tbody>
            <tr>
              <td>Fett</td>
              <td>Ctrl + B</td>
            </tr>
            <tr>
              <td>Kursiv</td>
              <td>Ctrl + I</td>
            </tr>
            <tr>
              <td>Unterstrichen</td>
              <td>Ctrl + U</td>
            </tr>
            <tr>
              <td>Alles auswählen</td>
              <td>Ctrl + A</td>
            </tr>
            <tr>
              <td>Wiederholen</td>
              <td>Ctrl + Y or Ctrl + Shift + Z</td>
            </tr>
            <tr>
              <td>Rückgängig machen</td>
              <td>Ctrl + Z</td>
            </tr>
            <tr>
              <td>Überschrift 1</td>
              <td>Shift + Alt + 1</td>
            </tr>
            <tr>
              <td>Überschrift 2</td>
              <td>Shift + Alt + 2</td>
            </tr>
            <tr>
              <td>Überschrift 3</td>
              <td>Shift + Alt + 3</td>
            </tr>
            <tr>
              <td>Überschrift 4</td>
              <td>Shift + Alt + 4</td>
            </tr>
            <tr>
              <td>Überschrift 5</td>
              <td>Shift + Alt + 5</td>
            </tr>
            <tr>
              <td>Überschrift 6</td>
              <td>Shift + Alt + 6</td>
            </tr>
            <tr>
              <td>Absatz</td>
              <td>Shift + Alt + 7</td>
            </tr>
            </tbody>
          </table>

        </v-card-text>
        <v-card-actions>
          <v-btn @click="showHelp=false">
            <v-icon left icon="mdi-check"></v-icon>
            <span>OK</span>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
</template>


<style scoped>

</style>
