<template>
  <Page :subtitle="$t('sets_page_subtitle')" :selectedType="selectedType">
    <div class="content">
      <SetsSidebar />
      <div class="main">
        <div class="sets-description">{{
          $t("sets_page_description")
        }}</div>
        <div class="kingdoms">
          <PresetKingdom v-for="kingdom in kingdoms" :key="kingdom.name" :kingdom="kingdom" />
        </div>
      </div>
    </div>
  </Page>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import useBase from "./base";
import Page from "../components/Page.vue";
import PresetKingdom from "../components/PresetKingdom.vue";
import SetsSidebar from "../components/SetsSidebar.vue";
import { DominionKingdoms } from "../dominion/dominion-kingdoms";
import { MenuItemType } from "../components/Page.vue";
import { useSetsStore } from '../pinia/sets-store';

export default defineComponent({
  name: "Sets", 
  components: {
    Page,
    PresetKingdom,
    SetsSidebar
  },
  setup() {
    useBase();
    const setsStore = useSetsStore()
    const selectedType = MenuItemType.SETS;

    const kingdoms = computed (() => {
      const setId = setsStore.selectedSetId;
      return DominionKingdoms.kingdoms[setId];
    });

  return {
      selectedType,
      kingdoms
    };
  }

});
</script>