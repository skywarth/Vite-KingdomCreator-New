<template>
  <div>
    <div v-for="set in sets" :set="set">
      <div class="preset-kingdom_title">
        <div class="preset-kingdom_title_name">{{ $t(set.setId) }}</div>
      </div>

      <!-- Supply Cards -->
      <GenericLayout :items="getCards(set.supplyCards,OtherCards(set, 'Normal Supply Cards'), sortBoxesSet)"
        :title="$t('Kingdoms Cards')" :shape="Shape.CARD" :showOverlay="false"
        :generic-nb-columns="numberOfColumnsForSupplyCards" :is-vertical="true" />
      <!-- generic slot : Events -->
      <!-- <GenericLayout :items="getCards(set.events.concat(OtherCards(set, 'Events')), sortBoxesSet)" :title="$t('Events')"
        :shape="Shape.CARD" :showOverlay="false" :generic-nb-columns="numberOfColumnsForAddons" :is-vertical="false" /> -->
      <!-- generic slot : Landmarks -->
      <!-- <GenericLayout :items="getCards(set.landmarks.concat(OtherCards(set, 'Landmarks')), sortBoxesSet)"
        :title="$t('Landmarks')" :shape="Shape.CARD" :showOverlay="false" :generic-nb-columns="numberOfColumnsForAddons"
        :is-vertical="false" /> -->
      <!-- generic slot : Projects -->
      <!-- <GenericLayout :items="getCards(set.projects.concat(OtherCards(set, 'Projects')), sortBoxesSet)"
        :title="$t('Projects')" :shape="Shape.CARD" :showOverlay="false" :generic-nb-columns="numberOfColumnsForAddons"
        :is-vertical="false" /> -->
      <!-- generic slot : Ways -->
      <!-- <GenericLayout :items="getCards(set.ways.concat(OtherCards(set, 'Ways')), sortBoxesSet)" :title="$t('Ways')"
        :shape="Shape.CARD" :showOverlay="false" :generic-nb-columns="numberOfColumnsForAddons" :is-vertical="false" /> -->
      <!-- generic slot : Boons -->
      <!-- <GenericLayout :items="getCards(set.boons.concat(OtherCards(set, 'Boons')), sortBoxesSet)" :title="$t('Boons')"
        :shape="Shape.CARD" :showOverlay="false" :generic-nb-columns="numberOfColumnsForAddons" :is-vertical="false" /> --> -->
      <!-- generic slot : Allies -->
      <!-- <GenericLayout :items="getCards(set.allies.concat(OtherCards(set, 'Allies')), sortBoxesSet)" :title="$t('Allies')"
        :shape="Shape.CARD" :showOverlay="false" :generic-nb-columns="numberOfColumnsForAddons" :is-vertical="false" /> -->
      <!-- generic slot : Traits -->
      <!-- <GenericLayout :items="getCards(set.traits.concat(OtherCards(set, 'Traits')), sortBoxesSet)" :title="$t('Traits')"
        :shape="Shape.CARD" :showOverlay="false" :generic-nb-columns="numberOfColumnsForAddons" :is-vertical="false" /> -->

      <!-- otherCards : Basic Supply Cards, Ruins, Shelters, Non-Supply, Travellers, Artefacts, Hexes, -->
      <!-- <GenericLayout v-for="card in GetOtherCardTypes('vertical')" :key="card.cardType"
        :items="getCards(OtherCards(set, card.cardType), challenge_sortBoxesSet(card.cardType))" :title="$t(card.title)"
        :shape="Shape.CARD" :showOverlay="false" :generic-nb-columns="numberOfColumnsForSupplyCards"
        :is-vertical="true" />

      <GenericLayout v-for="card in GetOtherCardTypes('horizontal')" :key="card.cardType"
        :items="getCards(OtherCards(set, card.cardType), sortBoxesSet)" :title="$t(card.title)" :shape="Shape.CARD"
        :showOverlay="false" :generic-nb-columns="numberOfColumnsForAddons" :is-vertical="false" />

      <GenericLayout v-for="card in GetOtherCardTypes('verticalMat')" :key="card.cardType"
        :items="getCards(OtherCards(set, card.cardType), sortBoxesSet)" :title="$t(card.title)" :shape="Shape.CARD"
        :showOverlay="false" generic-nb-columns=3 :is-vertical="true" />

      <GenericLayout v-for="card in GetOtherCardTypes('horizontalMat')" :key="card.cardType"
        :items="getCards(OtherCards(set, card.cardType), sortBoxesSet)" :title="$t(card.title)" :shape="Shape.CARD"
        :showOverlay="false" generic-nb-columns=2 :is-vertical="false" />

      <GenericLayout v-for="card in GetOtherCardTypes('squareMat')" :key="card.cardType"
        :items="getCards(OtherCards(set, card.cardType), sortBoxesSet)" :title="$t(card.title)"
        :shape="getshapeofmat(card.cardType)" :showOverlay="false" generic-nb-columns=3 :is-vertical="false" /> -->
    </div>
  </div>
</template>
 
<script lang="ts">
import GenericLayout from "./GenericLayout.vue";
import type { DominionSet } from "../dominion/dominion-set";
import { DominionSets } from "../dominion/dominion-sets";
import { SetId } from "../dominion/set-id";
import { Shape as shapeFromGridLayout } from "./GridLayout.vue";
import type { SupplyCard } from "../dominion/supply-card";
import { SupplyCardSorter } from "../utils/supply-card-sorter";

import { useWindowStore } from '../pinia/window-store';
import { useSetsStore } from "../pinia/sets-store";
import { defineComponent, computed, ref } from 'vue';
import { SortOption } from "../settings/settings";
// import type { OtherCard } from "@/dominion/other-card";
import { useI18n } from "vue-i18n";
import type { OtherCard } from "@/dominion/other-card";

const FOUR_COLUMN_SUPPLY_CARD_WIDTH = 450;
const TWO_COLUMN_ADDON_WIDTH = 525;

interface genericCardTypes {
  cardType: string;
  title: string;
}

const OTHER_CARD_TYPES: genericCardTypes[] = [
  { cardType: "Knight", title: "Supply Cards - Knights" }, /* dark Ages */
  { cardType: "Castle", title: "Supply Cards - Castles" }, /* empires */
  { cardType: "Basic Cards Treasure", title: "Basic Cards" },
  { cardType: "Basic Cards Victory", title: "Basic Cards" },
  { cardType: "Basic Cards", title: "Basic Cards" },
  { cardType: "Ruins", title: "Basic Cards - Ruins" }, /* dark Ages */
  { cardType: "Shelter", title: "Basic Cards - Shelters" }, /* dark Ages */
  { cardType: "Non-Supply Cards", title: "Non-Supply Cards" },
  { cardType: "Split Cards", title: "Supply Cards Split Piles" },
  { cardType: "Travellers Page", title: "Supply Cards - Travellers - Page Progression" }, /* adventures */
  { cardType: "Travellers Peasant", title: "Supply Cards - Travellers - Peasant Progression" }, /* adventures */
  { cardType: "Prize", title: "Non-Supply Cards" },
  { cardType: "Heirloom", title: "Non-Supply Cards - Heirlooms" }, /*nocturne */
  { cardType: "Loot", title: "Loot Cards" },
];

const OTHER_CARD_TYPES_HORIZONTAL: genericCardTypes[] = [
  { cardType: "Hexes", title: "Hexes" }, /*nocturne */
  { cardType: "States", title: "States" }, /*nocturne */
  { cardType: "Artifacts", title: "Artifacts" }, /* Renaissance */
];

const OTHER_CARD_TYPES_MAT_HORIZONTAL: genericCardTypes[] = [
  { cardType: "Mat Horizontal", title: "Mat included in box" },
];

const OTHER_CARD_TYPES_MAT: genericCardTypes[] = [
  { cardType: "Mat Vertical", title: "Mat included in box" },
];

const OTHER_CARD_TYPES_MAT_SQUARE: genericCardTypes[] = [
  { cardType: "Mat Square", title: "Mat included in box" },
  { cardType: "advToken", title: "Tokens included in box" },
  { cardType: "Tokens", title: "Tokens included in box" },
];


export default defineComponent({
  name: 'PresetBoxContent',
  components: {
    GenericLayout,
  },
  setup() {
    const windowStore = useWindowStore();
    const setsStore = useSetsStore();
    const { t } = useI18n();

    // const state = reactive({
    //   windowWidth: windowStore.width,
    //   isEnlarged: windowStore.isEnlarged,
    //   sortBoxesSet: setsStore.sortBoxesSet,
    //   : setsStore.selectedBoxesSetId,
    //   Shape,
    // });
    const Shape = shapeFromGridLayout
    const sortBoxesSet = ref(setsStore.sortBoxesSet)
    const sets = computed(() => {
      return [(DominionSets.sets[setsStore.selectedBoxesSetId] as DominionSet)];
    });
    const numberOfColumnsForSupplyCards = computed(() => {
      return windowStore.isEnlarged ? 2 : windowStore.width <= FOUR_COLUMN_SUPPLY_CARD_WIDTH ? 4 : 5;
    });
    const numberOfColumnsForAddons = computed(() => {
      return windowStore.isEnlarged ? 1 : windowStore.width <= TWO_COLUMN_ADDON_WIDTH ? 2 : 3;
    });
    const getshapeofmat = (mycardtype: string) => {
      if (mycardtype == 'advToken') return Shape.SMALLSQUARE
      return Shape.SQUARE
    };
    const getCards = (cardIds: SupplyCard[], otherCardsIds: OtherCard[], sortOption = SortOption.ORDERSTRING, origine = "unset") => {
      const allCards = (cardIds).concat(otherCardsIds);
      return SupplyCardSorter.sort(allCards, sortOption, t);
    };
    const OtherCards = (usingSet: DominionSet, typeRequested: string) => {
      return usingSet.otherCards.filter((card) => ((card.type).includes(typeRequested)));
    };
    const OtherCardTypes = (isVertical: boolean) => {
      return isVertical ? OTHER_CARD_TYPES : OTHER_CARD_TYPES_HORIZONTAL;
    };
    const GetOtherCardTypes = (typeRequested: string) => {
      if (typeRequested == 'horizontal') return OTHER_CARD_TYPES_HORIZONTAL;
      if (typeRequested == 'vertical') return OTHER_CARD_TYPES;
      if (typeRequested == 'horizontalMat') return OTHER_CARD_TYPES_MAT_HORIZONTAL;
      if (typeRequested == 'verticalMat') return OTHER_CARD_TYPES_MAT;
      if (typeRequested == 'squareMat') return OTHER_CARD_TYPES_MAT_SQUARE;
      return OTHER_CARD_TYPES;
    };
    const challenge_sortBoxesSet = (mycard_type: string) => {
      if (mycard_type == "Travellers Page" || mycard_type == "Travellers Peasant") return SortOption.COST;
      if (mycard_type == "Split Cards") return SortOption.ORDERSTRING;
      if (mycard_type == "Castle") return SortOption.COST;
      return setsStore.sortBoxesSet;
    };

    return {
      Shape,
      sortBoxesSet,
      sets,
      numberOfColumnsForSupplyCards,
      numberOfColumnsForAddons,
      getshapeofmat,
      getCards,
      OtherCards,
      OtherCardTypes,
      GetOtherCardTypes,
      challenge_sortBoxesSet,
    };
  },
});
</script>

<style>
@media (max-width: 450px) {
  .preset-kingdom_title_name {
    font-size: 30px;
    margin-right: 8px;
  }

  .preset-kingdom_set-name {
    font-size: 14px;
    padding: 4px 6px;
  }
}
</style>