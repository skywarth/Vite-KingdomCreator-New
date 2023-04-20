<template>
  <div>
    <div class="preset-set_title" >
      <div style="width:50%;">
        <span> {{ $t("Recommended Kingdoms Sets", nbKingdomRecommendedSet) }} </span>
      </div>
      <div>
      <span class="preset-show-hide_filter" v-show="!ShowFilterKingdom" v-on:click="showhidefilter"> [ {{ $t("show Kingdoms list") }} ] </span>
      <span class="preset-show-hide_filter" v-show= "ShowFilterKingdom" v-on:click="showhidefilter"> [ {{ $t("hide Kingdoms list") }} ] </span></div>
    </div>
    <div  class="preset-set_title" v-show="ShowFilterKingdom">
      <div class="preset-kingdom_title_sets" v-for="kingdom in kingdoms" v-show="toshow(kingdom)&&isGameDisplayed(kingdom.name)">
        <a style="text-decoration: none"  :href="'#' + kingdom.name">
          <span class="preset-kingdom_set-name"  :class="kingdom.setIds[0]">{{kingdom.name}}</span>
        </a>
      </div>
    </div>
    <PresetKingdom v-for="kingdom in kingdoms" :key="RefreshKingdomList" :kingdom="kingdom" v-show="toshow(kingdom)&&isGameDisplayed(kingdom.name)"/>
  </div>
</template>

<script lang="ts">

import PresetKingdom from "./PresetKingdom.vue";
import { DominionKingdoms } from "../dominion/dominion-kingdoms";
import type { DominionKingdom } from "../dominion/dominion-kingdom";
import { SetId } from "../dominion/set-id";
import { useSetsStore } from "../pinia/sets-store";
import { defineComponent, ref, computed, watch } from 'vue'

export default defineComponent({
  name: 'PresetKingdomList',
  components: {
    PresetKingdom
  },
  props: {
    RefreshKingdomList: {
      type: Number,
      required: true
    }
  },
setup() {
  const setsStore = useSetsStore()

  const ListSet = ref<SetId[]>([]);
  const ShowFilterKingdom = ref(false);
  ShowFilterKingdom.value = setsStore.showFilterKingdom;

  // get the selected set ID from the store and filter kingdoms accordingly
  const kingdoms = computed(() => {
    const setId:SetId = setsStore.selectedSetId;
    if (setId === SetId.ALL) {
      return DominionKingdoms.getAllKingdoms();
    }
    if (!(setId in DominionKingdoms.kingdoms)) { return []; }
    return DominionKingdoms.kingdoms[setId] 
  });

  // get the number of recommended kingdoms based on the current filter settings
  const nbKingdomRecommendedSet = computed(() => {
    let nbking= 0 * setsStore.needRefresh;
    for (var king of kingdoms.value!) {
      if (toshow(king) == true && isGameDisplayed(king.name) == true) {
        nbking +=1; 
      }
    }
    return nbking;
  });

  // check if the kingdom should be displayed based on the selected sets
  const toshow = (kingdom: DominionKingdom): boolean => {
    ListSet.value.concat(kingdom.setIds as SetId[]);
    for (var set of kingdom.setIds) {
      const elm = document.getElementById(set)!;
      if (elm !== null && elm.getAttribute('class') !==null) {
        if (! elm.getAttribute('class')!.includes(set)) {
          return false;
    } } } 
    return true;
  };

  // check if the kingdom should be displayed based on the selected play filter
  const isGameDisplayed = (kingdomName: string) => {
    if (setsStore.showFilterPlayGames == "PNP") { return true }
    let PlayedGames = setsStore.playedGames;
    let myIndex = PlayedGames.indexOf(kingdomName,0)
    if (setsStore.showFilterPlayGames == "P") {
      return (myIndex > -1) ? true : false;  }
    if (setsStore.showFilterPlayGames == "NP") {
      return myIndex > -1 ? false : true; }
    return true
  }

  const showhidefilter = () => {
    ShowFilterKingdom.value = !(ShowFilterKingdom.value);
    setsStore.updateShowFilterKingdom(ShowFilterKingdom.value);
    return ShowFilterKingdom;
  }

  return {
    ListSet,
      ShowFilterKingdom,
      kingdoms,
      nbKingdomRecommendedSet,
      toshow,
      isGameDisplayed,
      showhidefilter
    };
  }
});
</script>
