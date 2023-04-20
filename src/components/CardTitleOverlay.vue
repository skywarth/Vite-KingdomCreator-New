<template>
  <TextOverlay class="card-title-overlay">
    <span :class="titleClass">
      {{ title }}
    </span>
  </TextOverlay>
</template>


<script lang="ts">
import { defineComponent } from "vue";
import TextOverlay from './TextOverlay.vue';

export default defineComponent({
  name: 'CardTitleOverlay',
  components: {
    TextOverlay
  },
  props: {
    title: {
      type: String,
      required: true,
    },
    titleClass: {
      type: String,
      default: null,
    }
  }, setup(){}

})
</script>

<style>
.card-title-overlay {
  margin-top: -13px;
}
</style>