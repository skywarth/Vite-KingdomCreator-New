<template>
  <div>
    <transition name="slow-fade">
      <div v-if="ally" class="ally-header">Ally</div>
    </transition>
    <transition name="slow-fade">
      <GridLayout v-if="ally" :items="[ally]" :number-of-columns="numberOfColumns" :is-vertical="false">
        <template v-slot:default="slotProps">
          <FlippingCard :card="slotProps.item" :is-vertical="false" />
        </template>
      </GridLayout>
    </transition>
  </div>
</template>

<script lang="ts">
import GridLayout from "./GridLayout.vue";
import FlippingCard from "./FlippingCard.vue";

import { defineComponent, computed, ref } from 'vue';
import { useRandomizerStore } from "../pinia/randomizer-store";
import { useWindowStore } from "../pinia/window-store";


export default defineComponent({
  name: "AllySection",
  components: {
    GridLayout,
    FlippingCard
  },
  setup() {
    const randomizerStore = useRandomizerStore();
    const windowStore = useWindowStore()

    const ally = randomizerStore.kingdom.ally;
    const windowWidth = ref(windowStore.width);
    const isEnlarged = ref(windowStore.isEnlarged);

    const numberOfColumns = computed(() =>{
      return isEnlarged.value ? 1 : windowWidth.value > 525 ? 3 : 2;
    });

    return {
      ally,
      numberOfColumns
    }
  }
  })
</script>

<style>
.ally-header {
  margin: 10px 0 0;
  font-size: 20px;
}
</style>
