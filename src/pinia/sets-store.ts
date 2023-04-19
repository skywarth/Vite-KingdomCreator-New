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
    playedGames: [] as string[],
    needRefresh: 0
  }),
  persist: true,
  actions: {
    updateSelectedSet (setId: SetId) {
      this.selectedSetId = setId;
    },
    updateSortSet (sortOption: SortOption) {
      this.sortSet = sortOption;
    },
    updateShowFilterKingdom (showFilterKingdom: boolean) {
      this.showFilterKingdom = showFilterKingdom;
    },
    updateShowFilterPlayedGames (showFilterPlayGames: string) {
      this.showFilterPlayGames = showFilterPlayGames;
    },
    updateNeedRefresh () {
      this.needRefresh++;
    },
    updatePlayedGames(GameList: string[]) {
      this.playedGames = GameList;
    },
    updateSelectedBoxesSet (setId: SetId) {
      this.selectedBoxesSetId = setId;
    },
    updateSortBoxesSet (sortOption: SortOption) {
      this.sortBoxesSet = sortOption;
    }
  }
});
