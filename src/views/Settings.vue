<template>
  <Page :subtitle="$t('settings_page_subtitle')" :selectedType="selectedType">
    <div class="contentRules main">
      <DeskSizeSettings />
      <OwnedExpansionsSettings />
      <RandomizeConstraintsSettings />
    </div>
  </Page>
</template>


<script lang="ts">
import { defineComponent } from 'vue';
import useBase from "./base";
import Page, { MenuItemType } from "../components/Page.vue";
import DeskSizeSettings from "../components/DeskSizeSettings.vue";
import RandomizeConstraintsSettings from "../components/RandomizeConstraintsSettings.vue";
import OwnedExpansionsSettings from "../components/OwnedExpansionsSettings.vue";
//import CardToExclude from "../components/CardToExclude.vue";


export default defineComponent({
  name: "Settings",
  components: {
    Page,
    OwnedExpansionsSettings,
    RandomizeConstraintsSettings,
    DeskSizeSettings,
  },
  setup() {
    useBase();
    const selectedType = MenuItemType.SETTINGS;

    return {
      selectedType,
    };
  }
});
</script>

