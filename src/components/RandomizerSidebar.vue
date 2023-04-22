<template>
  <div class="sidebar">
    <a class="standard-button standard-button--is-primary standard-button--large desktop_randomize-button"
      v-if="!isCondensed" @click="handleRandomize">
      {{ $t(randomizeButtonText) }}
    </a>
    <div class="sidebar-content filters">
      <div class="sidebar-content-title">{{ $t("Sets") }}</div>
      <div class="sets">
        <div class="set" v-for="set in sets" :key="set.setId">
          <label class="checkbox">
            <input type="checkbox" v-model="selectedSetIds" :id="set.setId" :value="set.setId">
            <span>{{ $t(set.setId) }} <span v-if="FindMultipleVersionSets(set.setId).length !== 0"> - 1st</span></span>
          </label>
          <span v-if="FindMultipleVersionSets(set.setId).length !== 0">
            <label class="checkbox suboption-set">
              <input type="checkbox" v-model="selectedSetIds" :id="(FindMultipleVersionSets(set.setId))[0].idv2"
                :value="(FindMultipleVersionSets(set.setId))[0].idv2">
              <span>2nd</span>
            </label>
          </span>
        </div>
      </div>
      <div class="clear"></div>
      <div class="sidebar-content-title">{{ $t("Options") }}</div>
      <div class="option">
        <label class="checkbox">
          <input type="checkbox" v-model="requireActionProvider">
          <span>{{ $t("Require +2 Action") }}</span>
        </label>
      </div>
      <div class="option">
        <label class="checkbox">
          <input type="checkbox" v-model="requireCardProvider">
          <span>{{ $t("Require Drawer") }}</span>
        </label>
      </div>
      <div class="option">
        <label class="checkbox">
          <input type="checkbox" v-model="requireBuyProvider">
          <span>{{ $t("Require Buy") }}</span>
        </label>
      </div>
      <div class="option">
        <label class="checkbox">
          <input type="checkbox" v-model="allowAttacks">
          <span>{{ $t("Allow Attacks") }}</span>
        </label>
        <div class="suboption">
          <label class="checkbox" :class="{ disable: !allowAttacks }">
            <input type="checkbox" v-model="requireReaction" :disabled="!allowAttacks">
            <span>{{ $t("Require Reaction") }}</span>
          </label>
        </div>
      </div>
      <div class="option">
        <label class="checkbox">
          <input type="checkbox" v-model="requireTrashing">
          <span>{{ $t("Require Trashing") }}</span>
        </label>
      </div>
      <div class="option" v-if="isAlchemySelected">
        <label class="checkbox">
          <input type="checkbox" v-model="isAlchemyRecommendationEnabled">
          <span>{{ $t("3Plus_Alchemy_Cards") }}</span>
        </label>
      </div>
      <div class="option" v-if="isDistributeCostAllowed">
        <label class="checkbox">
          <input type="checkbox" v-model="distributeCost">
          <span>{{ $t("Distribute Cost") }}</span>
        </label>
      </div>
      <div class="option" v-if="isPrioritizeSetAllowed">
        <label class="checkbox">
          <input type="checkbox" v-model="isPrioritizeSetEnabled">
          <span>{{ $t("Prioritize Set") }}</span>
        </label>
        <div class="suboption">
          <select :disabled="!isPrioritizeSetEnabled" v-model="prioritizeSet">
            <option v-if="prioritizeSet == null" :value="null">{{ $t("Choose set") }}</option>
            <option v-for="setId in selectedSetIds" :value="setId" :key="setId">
              {{ getSetName(setId) }}
            </option>
          </select>
        </div>
      </div>
      <div class="sidebar-content-title">{{ $t("Sort") }}</div>
      <div class="option" v-for="sortOption in sortOptions" :key="sortOption.value">
        <label class="checkbox">
          <input type="radio" name="sortOption" :value="sortOption.value" v-model="selectedSortOption">
          <span>{{ $t(sortOption.display) }}</span>
        </label>
      </div>
      <a class="standard-button standard-button--is-primary standard-button--large condensed_randomize-button"
        v-if="isCondensed" @click="handleRandomize">
        {{ $t(randomizeButtonText) }}
      </a>
    </div>
  </div>
</template>

<script lang="ts">
import { DominionSets } from "../dominion/dominion-sets";
import { MultipleVersionSets, HideMultipleVersionSets } from "../dominion/set-id";
import type { SetId } from "../dominion/set-id";
import type { SettingsParams } from "../settings/settings";
import { SortOption } from "../settings/settings";
import type { RandomizerSettingsParams, RandomizerSettingsParamsBoolean } from "../settings/randomizer-settings";
import { useWindowStore } from "../pinia/window-store";
import { useRandomizerStore } from "../pinia/randomizer-store";
import { defineComponent, ref, computed } from "vue";

// interface SortOptionParam {
//   value: SortOption,
//   display: string,
// }

export default defineComponent({
  name: "RandomizerSidebar",
  components: {
  },
  setup(props, { emit }) {
    const randomizerStore = useRandomizerStore()
    const windowStore = useWindowStore()
    const isCondensed = ref(windowStore.isCondensed);
    const isDistributeCostAllowed = ref(randomizerStore.isDistributeCostAllowed);
    const isPrioritizeSetAllowed = ref(randomizerStore.isPrioritizeSetAllowed);
    const isAlchemySelected = ref(randomizerStore.isAlchemySelected);
    const randomizeButtonText = ref(randomizerStore.randomizeButtonText);
    const settings = ref(randomizerStore.settings);
    const randomizerSettings = ref(randomizerStore.settings.randomizerSettings);

    const sets = computed(() => {
      return DominionSets.getAllSets().filter(set => { return (HideMultipleVersionSets.indexOf(set.setId) == -1) });
    });

    const selectedSetIds = computed({
      get: () => settings.value.selectedSets.concat().sort(),
      set: (values: string[]) => {
        // Clear the prioritized set if it's no longer selected.
        if (!values.some(x => x == prioritizeSet.value)) {
          updateRandomizerSettings({ prioritizeSet: null });
        }
        randomizerStore.UPDATE_SETTINGS({
          selectedSets: values.map(DominionSets.convertToSetId)
        } as SettingsParams);
      },
    })

    const FindMultipleVersionSets = (setValue: string) => {
      return MultipleVersionSets.filter(set => { return (set.id === setValue) })
    }



    // const randomizerSettings = ref(randomizerStore.settings.randomizerSettings);

    type SettingsObject = {
      [key: string]: boolean;
    }
    // function createComputedSettingsObject(property: keyof RandomizerSettings) {
    //   return computed({
    //     get: () => randomizerSettings.value[property],
    //     set: (value: boolean) => {
    //       // const updateObject: SettingsObject = {};
    //       // updateObject[property] = value;
    //       updateRandomizerSettings(updateObject);
    //     }
    //   });
    // }

    function createComputedSettingsObject(property: keyof RandomizerSettingsParamsBoolean) {
  return computed<boolean>({
    // Calcul de la propriété
    get: (): boolean => randomizerSettings.value[property],
    // Mise à jour de la propriété
    set: (value: boolean) => {
      const updateObject: SettingsObject = {};
      updateObject[property] = value;
      updateRandomizerSettings(updateObject);
    }
  });
}




    const requireActionProvider = createComputedSettingsObject('requireActionProvider');
    const requireCardProvider = createComputedSettingsObject('requireCardProvider');
    const requireBuyProvider = createComputedSettingsObject('requireBuyProvider');
    const allowAttacks = createComputedSettingsObject('allowAttacks');
    const requireReaction = createComputedSettingsObject('requireReaction');
    const requireTrashing = createComputedSettingsObject('requireTrashing');
    const distributeCost = createComputedSettingsObject('distributeCost');

    // const prioritizeSet = createComputedSettingsObject('prioritizeSet');

    const isAlchemyRecommendationEnabled = createComputedSettingsObject('isAlchemyRecommendationEnabled');

    const sortOptions = [
      { display: "Set", value: SortOption.SET },
      { display: "Alphabetical", value: SortOption.ALPHABETICAL },
      { display: "Cost", value: SortOption.COST },
    ];

    const selectedSortOption = computed({
      get: () => settings.value.sortOption,
      set: (sortOption: SortOption) => {
        randomizerStore.UPDATE_SETTINGS({ sortOption: sortOption } as SettingsParams);
      }
    })

    const prioritizeSet = computed({
      get: () => randomizerSettings.value.prioritizeSet,
      set: (value: SetId | null) => { updateRandomizerSettings({ prioritizeSet: value }) }
    })

    const isPrioritizeSetEnabled = computed({
      get: () => { return randomizerSettings.value.prioritizeSet != null },
      set: (value: boolean) => {
        const setId = value && selectedSetIds.value.length
          ? DominionSets.convertToSetId(selectedSetIds.value.concat().sort()[0])
          : null;
        updateRandomizerSettings({ prioritizeSet: setId });
      }
    })

    const getSetName = (setId: SetId) => {
      return DominionSets.getSetById(setId).name;
    }

    const handleRandomize = () => {
      emit("randomize")
    }

    const updateRandomizerSettings = (params: RandomizerSettingsParams) => {
      randomizerStore.UPDATE_SETTINGS({
        randomizerSettings: params
      } as SettingsParams);
    }

    return {
      randomizeButtonText,
      handleRandomize,
      isCondensed,
      sets,
      selectedSetIds,
      FindMultipleVersionSets,
      requireActionProvider,
      requireBuyProvider,
      requireCardProvider,
      requireReaction,
      requireTrashing,
      allowAttacks,
      prioritizeSet,
      isPrioritizeSetAllowed,
      isPrioritizeSetEnabled,
      selectedSortOption,
      sortOptions,
      distributeCost,
      isDistributeCostAllowed,
      isAlchemySelected,
      isAlchemyRecommendationEnabled,
      getSetName,
      updateRandomizerSettings,

    }
  }
})
</script>

<style>
.desktop_randomize-button,
.condensed_randomize-button {
  display: block;
  margin: 2px;
}

.condensed_randomize-button {
  margin-top: 12px;
}
</style>