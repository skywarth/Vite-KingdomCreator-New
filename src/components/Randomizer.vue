<template>
  <div class="content">
    <RandomizerSidebar @randomize="handleRandomize" />
    <div class="main">
      <SortableSupplyCards />
      <Addons />
      <Boons />
      <AllySection />
      <Modifiers />
      <div style="margin-top: 4px;" >
        <CopyButton
          :text="supplyCardsCopyText"
          class="randomizer-copy-button"
        />
        <FullScreenButton
        :text="supplyCardsCopyText"
        class="randomizer-copy-button"
      /></div>
    </div>
    <div class="clearfix"></div>
  </div>
</template>

<script lang="ts">
import Addons from "./Addons.vue";
import AllySection from "./AllySection.vue";
import Boons from "./Boons.vue";
// import SortableSupplyCards from "./SortableSupplyCards.vue";
import RandomizerSidebar from "./RandomizerSidebar.vue";

import { deserializeKingdom, serializeKingdom } from "../randomizer/serializer";
// import Modifiers from "./Modifiers.vue";
import type { Card } from "../dominion/card";
import CopyButton from "./CopyButton.vue";
// import FullScreenButton from "./FullScreenButton.vue";

import { useRandomizerStore } from "../pinia/randomizer-store";
import { useWindowStore } from "../pinia/window-store";
import { defineComponent, watch} from 'vue';
import { useRoute, useRouter } from "vue-router";

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
    const kingdom = randomizerStore.kingdom
    const settings = randomizerStore.settings
    // const randomizerSettings = randomizerStore.settings.randomizerSettings

    const supplyCardsCopyText = () => {
      return (
        (kingdom.supply.supplyCards as Card[]).concat(
          kingdom.events,
          kingdom.landmarks,
          kingdom.projects,
          kingdom.ways,
          kingdom.boons,
          kingdom.ally ? [kingdom.ally] : [],
          kingdom.traits
        ).map((card) => card.id).join(', ')
      )
    }

    const handleRandomize = () => {
      randomizerStore.RANDOMIZE()
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
      const query = {
        // ...route.query,
        ...serializeKingdom(kingdom),
      }
      if (!isEqual(route.query, query)) {
        router.replace({ query })
      }
    })

    const kingdomFromUrl = deserializeKingdom(route.query, settings.selectedSets)
    randomizerStore.LOAD_INITIAL_KINGDOM(kingdomFromUrl)

    return {
      supplyCardsCopyText,
      handleRandomize,
      
    }
  }
});
</script>

<style>
.randomizer-copy-button {
  margin-top: 4px;
}
</style>