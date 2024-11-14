<template>
  <div v-if="hasInvalidCards">
    <p class="warning">
      {{ $t("Avertissement :") }} {{  $t("Royaume ne respectant pas les contraintes de paramétrage") }}
    </p>
    <ul v-if="invalidCardsFromNonSelectedSets.length > 0">
      {{ $t("Carte non présente dans les extensions sélectionnées") }}
      <li v-for="card in invalidCardsFromNonSelectedSets" :key="card.id">
        {{ $t(card.name) }} 
      </li>
    </ul>
    <ul v-if="invalidCardsFromExcludedList.length > 0">
      {{ $t("Carte exclue selon les paramètres de configuration") }}
      <li v-for="card in invalidCardsFromExcludedList" :key="card.id">
        {{ $t(card.name) }} 
      </li>
    </ul>
    <ul v-if="invalidSpecialCardRules.length > 0">
      {{ $t("Problèem de suivi de régles") }}
      <li v-for="message in invalidSpecialCardRules">
        {{ message }}
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
/* import Vue, typescript */
import { defineComponent, computed, ref} from "vue";

/* import Dominion Objects and type*/
import type { Card } from "../dominion/card";
import { SetId } from "../dominion/set-id";
import { initializeExcludedCardIds } from "../randomizer/randomizer-options"
import { YOUNG_WITCH_IDS, BANE_MIN_COST, BANE_MAX_COST} from "../randomizer/special-need-cards";
import { FERRYMAN_IDS, FERRYMAN_MIN_COST, FERRYMAN_MAX_COST } from "../randomizer/special-need-cards";
import { OBELISK_LANDMARK_ID, OBELISK_CARDTYPE_REQUESTED } from "../randomizer/special-need-cards";
import { MOUSE_WAY_ID, MOUSE_MIN_COST, MOUSE_MAX_COST } from "../randomizer/special-need-cards";
import { TRAITS_CARDTYPE_POSSIBILITY_1, TRAITS_CARDTYPE_POSSIBILITY_2 } from "../randomizer/special-need-cards";

/* import store  */
import { useRandomizerStore } from "../pinia/randomizer-store";
import { useSettingsStore } from "../pinia/settings-store";

/* import Components */

export default defineComponent({
  name: 'KingdomNotValid',
  setup() {
    const randomizerStore = useRandomizerStore();
    const kingdom = computed(()=> randomizerStore.kingdom);
    const settings = ref(randomizerStore.settings);
    const settingsStore= useSettingsStore();
  
    const allKingdomCards =  [
        ...kingdom.value.supply.supplyCards,
        ...(kingdom.value.supply.baneCard ? [kingdom.value.supply.baneCard] : []),
        ...(kingdom.value.supply.ferrymanCard ? [kingdom.value.supply.ferrymanCard] : []),
        ...(kingdom.value.supply.obeliskCard ? [kingdom.value.supply.obeliskCard] : []),
        ...(kingdom.value.supply.mouseWay ? [kingdom.value.supply.mouseWay] : []),
        ...kingdom.value.supply.traitsSupply,
        ...kingdom.value.events,
        ...kingdom.value.landmarks,
        ...kingdom.value.projects,
        ...kingdom.value.ways,
        ...(kingdom.value.boons ? kingdom.value.boons : []),
        ...(kingdom.value.ally ? [kingdom.value.ally] : []),
        ...(kingdom.value.prophecy ? [kingdom.value.prophecy]  : []),
        ...kingdom.value.traits as Card[]
      ];
   
    const selectedSets = settings.value.selectedSets;

    const hasInvalidCards = computed(() => { 
      const invalidCards = [];
            // Check for cards not belonging to selected sets
      invalidCards.push(...invalidCardsFromNonSelectedSets.value);
      invalidCards.push(...invalidCardsFromExcludedList.value);
    return invalidCards.length > 0 || invalidSpecialCardRules.value.length > 0;
    });

    const containsNotValidCards = (kingdomCards: Card[], selectedSets: SetId[]) : Card[]=> {
      const selectedCards = kingdomCards.filter(card =>
        selectedSets.includes(card.setId)
      );
      return kingdomCards.filter(card => !selectedCards.includes(card));
    };

    const invalidCardsFromNonSelectedSets = computed(() => { 
      const  invalidCardsFromNonSelectedSets = containsNotValidCards(
        allKingdomCards, selectedSets
      );
      return invalidCardsFromNonSelectedSets
    })

    const invalidCardsFromExcludedList = computed(() => { 
      if (settingsStore.useConstraintOnRandomization) {
        const excludedCardIds = initializeExcludedCardIds(selectedSets, []);
        const invalidCardsFromExcludedList = 
            allKingdomCards.filter(
                card => excludedCardIds.includes(card.id)
            );
        return invalidCardsFromExcludedList
      } else return [] as Card[]
    })

    const invalidSpecialCardRules = computed(() => { 
      const invalidSpecialCardRules = [];
      // Check for special card rules
      invalidSpecialCardRules.push(...YOUNG_WITCHRule())
      invalidSpecialCardRules.push(...FERRYMANRule())
      /*   
    if (this.landmarks.includes(DominionSets.getLandmarkById(OBELISK_LANDMARK_ID))) {
      if (this.supply.obeliskCard == null) return false;
    } else {
      if (this.supply.obeliskCard != null) return false;
    }
    if (this.ways.includes(DominionSets.getWayById(MOUSE_WAY_ID))) {
      if (this.supply.mouseWay == null) return false;
    } else {
      if (this.supply.mouseWay != null) return false;
    }
    if (this.traits.length >0 ) {
      if (this.supply.traitsSupply.length != this.traits.length) return false;
    } */
      return invalidSpecialCardRules;
    })

    const YOUNG_WITCHRule = () => {
      const invalidSpecialCardRules = [];
      if (kingdom.value.supply.supplyCards.some(card => YOUNG_WITCH_IDS.includes(card.id))) {
        if (!kingdom.value.supply.baneCard) {
          invalidSpecialCardRules.push("Young Witch nécessite une Bane Card.");
        } else {
          if (kingdom.value.supply.baneCard.cost.treasure < BANE_MIN_COST ||
              kingdom.value.supply.baneCard.cost.treasure > BANE_MAX_COST)
            invalidSpecialCardRules.push("La Bane Card doit avoir une coût entre "+ BANE_MIN_COST + " et " + BANE_MAX_COST );
        }
      } else {
        if (kingdom.value.supply.baneCard) {
          invalidSpecialCardRules.push("La présence d'une Bane Card nécessite une Young Witch.");
        }
      }
    return invalidSpecialCardRules;
    }

    const FERRYMANRule = () => {
      const invalidSpecialCardRules = [];
      if (kingdom.value.supply.supplyCards.some(card => FERRYMAN_IDS.includes(card.id))) {
        if (!kingdom.value.supply.ferrymanCard) {
          invalidSpecialCardRules.push("Ferryman nécessite une ferryan Card.");
        } else {
          if (kingdom.value.supply.ferrymanCard.cost.treasure < FERRYMAN_MIN_COST ||
              kingdom.value.supply.ferrymanCard.cost.treasure > FERRYMAN_MAX_COST)
            invalidSpecialCardRules.push("La ferryman Card doit avoir une coût entre "+ FERRYMAN_MIN_COST + " et " + FERRYMAN_MAX_COST );
        }
      } else {
        if (kingdom.value.supply.ferrymanCard) {
          invalidSpecialCardRules.push("La présence d'une ferryman Card nécessite un Ferryman.");
        }
      }
    return invalidSpecialCardRules;
    }

    return {
      hasInvalidCards,
      invalidCardsFromNonSelectedSets,
      invalidCardsFromExcludedList,
      invalidSpecialCardRules
    }
  }
});
</script>