// Pinia Store
import { defineStore } from 'pinia';

import { SetId } from "../dominion/set-id";
import { SortOption } from "../settings/settings";

export interface State {
  selectedSetId: SetId;
  sortSet: string;
  selectedBoxesSetId: SetId;
  sortBoxesSet: string;
  showFilterKingdom: boolean;
  showFilterPlayGames: string;
  needRefresh: number
};

export const useSetsStore = defineStore(
  'setsStore', {
  state: () => ({
    selectedSetId: SetId.BASE_SET,
    sortSet: SortOption.SET,
    selectedBoxesSetId: SetId.BASE_SET,
    sortBoxesSet: SortOption.ALPHABETICAL,
    showFilterKingdom: false,
    showFilterPlayGames: "PNP",
    needRefresh: 0
  }),
  actions: {
    updateSelectedSet (setId: SetId) {
      this.selectedSetId = setId;
    },
    updateSelectedBoxesSet (setId: SetId) {
      this.selectedBoxesSetId = setId;
    },
    updateShowFilterKingdom (showFilterKingdom: boolean) {
      this.showFilterKingdom = showFilterKingdom;
    },
    updateFilterPlayedGames (showFilterPlayGames: string) {
      this.showFilterPlayGames = showFilterPlayGames;
    },
    updateNeedRefresh () {
      this.needRefresh++;
    },
    updateSortSet (sortOption: SortOption) {
      this.sortSet = sortOption;
    },
    updateSortBoxesSet (sortOption: SortOption) {
      this.sortBoxesSet = sortOption;
    }
  }
});
