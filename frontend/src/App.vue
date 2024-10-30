<template>
  <div id="app">
    <SubmitAssignment />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import SubmitAssignment from './components/SubmitAssignment.vue';

export default defineComponent({
  components: {
    SubmitAssignment,
  },
});
</script>

<style>
#app {
  padding: 20px;
}
</style>
