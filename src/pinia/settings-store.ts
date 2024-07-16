// Pinia Store
import { defineStore } from 'pinia';

export interface SettingsState {
  isUsingCustom: boolean, 
  KingdomNb: number,
  AddonsNb: number,
  EventsMax: number,
  LandmarksMax: number,
  ProjectsMax: number,
  WaysMax: number,
  TraitsMax: number,
};

export const useSettingsStore = defineStore(
  'settingsStore', {
  state: () => ({
    isUsingCustom: false, 
    KingdomNb: 10,
    AddonsNb: 2,
    EventsMax: 2,
    LandmarksMax: 2,
    ProjectsMax: 2,
    WaysMax: 2,
    TraitsMax: 2,
  }),
  persist: true,
  actions: {
    updateSettings(newState: Partial<SettingsState>) {
      // Update multiple properties efficiently using object spread
      this.$patch((state) => {
        Object.assign(state, newState);
      });
    },


    updateisUsingCustom (isUsingCustom: boolean) {
      this.isUsingCustom = isUsingCustom;
    },
    updateKingdomNb (KingdomNb: number) {
      this.KingdomNb = KingdomNb;
    },
    updateAddonsNb(AddonsNb: number) {
      this.AddonsNb = AddonsNb;
    },
    updateEventsMax(EventsMax: number) {
      this.EventsMax = EventsMax;
    },
    updateLandmarksMax(landmarks: number) {
      this.LandmarksMax = landmarks;
    },
    updateProjectsMax(ProjectsMax: number) {
      this.ProjectsMax = ProjectsMax;
    },
    updateWaysMax(WaysMax: number) {
      this.WaysMax = WaysMax;
    },
    updateTraitsMax(TraitsMax: number) {
      this.TraitsMax = TraitsMax;
    }
  }
});
