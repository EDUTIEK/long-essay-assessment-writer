<template>
  <v-navigation-drawer elevation="2" color="grey-lighten-2" rail expand-on-hover>

    <v-list>
      <v-list-item prepend-icon="mdi-text-box-outline" title="Aufgabenstellung"></v-list-item>
      <v-list-item prepend-icon="mdi-file-edit-outline" title="Essay schreiben"></v-list-item>
      <v-list-item prepend-icon="mdi-clipboard-outline" title="Notizbrett 1"></v-list-item>
      <v-list-item prepend-icon="mdi-clipboard-outline" title="Notizbrett 2"></v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
export default {
  name: "NavBar"
}
</script>

<style scoped>

</style>