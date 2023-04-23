<template>
  <div class="content">
    <RandomizerSidebar @randomize="handleRandomize" />
    <div class="main">
      <SortableSupplyCards />
      <!-- <Addons />
      <Boons />
      <AllySection />
      <Modifiers /> -->
      <div style="margin-top: 4px;">
        <CopyButton :text="supplyCardsCopyText" class="randomizer-copy-button" />
        <FullScreenButton :text="supplyCardsCopyText" class="randomizer-copy-button" />
      </div>
    </div>
    <div class="clearfix"></div>
  </div>
</template>

<script lang="ts">
/* import Vue, typescript */
import { defineComponent, ref, computed } from 'vue';
import { onBeforeMount, watch } from 'vue';
import { useRoute, useRouter } from "vue-router";

/* import Dominion Objects and type*/
import type { Card } from "../dominion/card";

/* imoprt store  */
import { useRandomizerStore } from "../pinia/randomizer-store";
import { useWindowStore } from "../pinia/window-store";
import { deserializeKingdom, serializeKingdom } from "../randomizer/serializer";

/* import Components */
import Addons from "./Addons.vue";
import AllySection from "./AllySection.vue";
import Boons from "./Boons.vue";
import CopyButton from "./CopyButton.vue";
import FullScreenButton from "./FullScreenButton.vue";
import Modifiers from "./Modifiers.vue";
import RandomizerSidebar from "./RandomizerSidebar.vue";
import SortableSupplyCards from "./SortableSupplyCards.vue";

export default defineComponent({
  name: "Randomizer",
  components: {
    Addons,
    AllySection,
    Boons,
    CopyButton,
    FullScreenButton,
    Modifiers,
    RandomizerSidebar,
    SortableSupplyCards,
  },
  setup() {
    const randomizerStore = useRandomizerStore()
    const windowStore = useWindowStore()
    const route = useRoute()
    const router = useRouter()
    const kingdom = ref(randomizerStore.kingdom)
    const settings = ref(randomizerStore.settings)

    const randomizerSettings = randomizerStore.settings.randomizerSettings

    const supplyCardsCopyText = computed(() => {
      return (
        (kingdom.value.supply.supplyCards as Card[]).concat(
          kingdom.value.events,
          kingdom.value.landmarks,
          kingdom.value.projects,
          kingdom.value.ways,
          kingdom.value.boons,
          kingdom.value.ally ? [kingdom.value.ally] : [],
          kingdom.value.traits
        ).map((card) => card.id).join(', ')
      )
    })

    // const state = reactive({
    //   kingdom: randomizerStore.kingdom,
    //   settings: randomizerStore.settings,
    // })
    // console.log()
    // const supplyCardsCopyText = computed(() => {
    //   return (
    //     (state.kingdom.supply.supplyCards as Card[]).concat(
    //       state.kingdom.events,
    //       state.kingdom.landmarks,
    //       state.kingdom.projects,
    //       state.kingdom.ways,
    //       state.kingdom.boons,
    //       state.kingdom.ally ? [state.kingdom.ally] : [],
    //       state.kingdom.traits
    //     ).map((card) => card.id).join(', ')
    //   )
    // })

    const handleRandomize = () => {
      console.log("in handle randomize")
      console.log(kingdom.value)
      randomizerStore.RANDOMIZE()
      console.log("in handle randomize --- end")
      console.log(kingdom.value)
    }

    const isEqual = (a: any, b: any) => {
      const keysA = Object.keys(a)
      const keysB = Object.keys(b)
      if (keysA.length !== keysB.length) {
        return false
      }
      for (const key of keysA) {
        if (a[key] !== b[key]) {
          return false
        }
      }
      return true
    }

    watch(kingdom, () => {
      console.log("change in kingdom")
      const query = {
        // ...route.query,
        ...serializeKingdom(kingdom.value),
      }
      if (!isEqual(route.query, query)) {
        router.replace({ query })
      }
    })

    onBeforeMount(() => {
      console.log("onBeforeMount - randomizer")
      const kingdomFromUrl = deserializeKingdom(route.query, settings.value.selectedSets)
      randomizerStore.LOAD_INITIAL_KINGDOM(kingdomFromUrl)
      console.log("onBeforeMount - randomizer - end")
    })

    return {
      supplyCardsCopyText,
      handleRandomize,
      kingdom,
      settings
    }
  }
});
</script>

<style>
.randomizer-copy-button {
  margin-top: 4px;
}
</style>