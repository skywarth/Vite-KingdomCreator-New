<template>
  <div class="sidebar">
    <div class="sidebar-content">
      <div class="sidebar-content-title">{{ $t("Sets content") }}</div>
      <div class="set">
        <div class="sets" v-for="set in sets" :key="set.setId">
          <label class="checkbox">
            <input type="radio" v-model="selectedBoxesSetId" :id="set.setId" :value="set.setId"
              @change="handleSelectionChange(set.setId)">
            <span>{{ $t(set.setId) }} <span v-if="findMultipleVersionSets(set.setId).length !== 0"> - 1st</span></span>
          </label>
          <span v-if="findMultipleVersionSets(set.setId).length !== 0">
            <label class="checkbox suboption-set">
              <input type="radio" v-model="selectedBoxesSetId" :id="findMultipleVersionSets(set.setId)[0].idv2"
                :value="findMultipleVersionSets(set.setId)[0].idv2" @change="handleSelectionChange(set.setId)">
              <span>2nd</span>
            </label>
          </span>
        </div>
      </div>
      <div class="clear"></div>

      <div class="sidebar-content-title">{{ $t("Sort") }}</div>
      <div class="option" v-for="sortOption in sortOptions" :key="sortOption.value">
        <label class="checkbox">
          <input type="radio" name="sortOption" :value="sortOption.value" v-model="sortBoxesSet" @change="handleSortChange(sortOption.value)">
          <span>{{ $t(sortOption.display) }}</span>
        </label>
      </div>

    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue';
import { DominionSets } from "../dominion/dominion-sets";
import type { SetId } from "../dominion/set-id";
import { MultipleVersionSets, HideMultipleVersionSets } from "../dominion/set-id";
import { SortOption } from "../settings/settings";
import { useSetsStore } from '../pinia/sets-store';

const sortOptions = [
  { display: "Alphabetical", value: SortOption.ALPHABETICAL },
  { display: "Cost", value: SortOption.COST },
];


export default defineComponent({
  name: 'BoxesSidebar',
  setup() {
    const setsStore = useSetsStore()
    const selectedBoxesSetId = ref(setsStore.selectedBoxesSetId)
    const sortBoxesSet = ref(setsStore.sortBoxesSet);

    const sets = DominionSets.getAllSets()
      .filter(set => { return (HideMultipleVersionSets.indexOf(set.setId) == -1) });

    const handleSelectionChange = (value: SetId) => {
      setsStore.updateSelectedBoxesSet(value);
    };

    const handleSortChange = (value: SortOption) => {
      console.log(value);
      setsStore.updateSortBoxesSet(value);
    };
    
    const findMultipleVersionSets = (setValue: string) => {
      return MultipleVersionSets.filter(set => {
        return (set.id === setValue)
      });
    };

    return {
      selectedBoxesSetId,      
      sortBoxesSet,

      sortOptions,
      sets,
      handleSelectionChange,
      handleSortChange,
      findMultipleVersionSets
    };
  }
});
</script>