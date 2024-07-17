import { getActivePinia } from 'pinia'; // Import Pinia
import { useSettingsStore } from '../pinia/settings-store';
import { Addons_TYPE } from '../dominion/addon';

const Default_NUM_CARDS_IN_KINGDOM = 10
export function NUM_CARDS_IN_KINGDOM() : number {
    const activePinia = getActivePinia();
    if (activePinia) {
        // Pinia store is initialized*
        const settingStore = useSettingsStore();
        if (settingStore.isUsingCustom)
            return settingStore.KingdomNb
        // isUsingCustom is false
    } 
    // Pinia store is not initialized
    return Default_NUM_CARDS_IN_KINGDOM
}

export function USING_CUTOM() : boolean {
    const activePinia = getActivePinia();
    if (activePinia) {
        // Pinia store is initialized*
        const settingStore = useSettingsStore();
        return settingStore.isUsingCustom;
    }
    return false
}

// Addon constants.
const Default_MAX_ADDONS_IN_KINGDOM = 2;
export function MAX_ADDONS_IN_KINGDOM() : number {
    const activePinia = getActivePinia();
    if (activePinia) {
        // Pinia store is initialized*
        const settingStore = useSettingsStore();
        if (settingStore.isUsingCustom)
            return settingStore.AddonsNb
        // isUsingCustom is false
    } 
    // Pinia store is not initialized
    return Default_MAX_ADDONS_IN_KINGDOM
}

// force addons usage.
const Default_FORCE_ADDONS_USE = false;
export function FORCE_ADDONS_USE() : boolean {
    const activePinia = getActivePinia();
    if (activePinia) {
        // Pinia store is initialized*
        const settingStore = useSettingsStore();
        if (settingStore.isUsingCustom)
            return settingStore.forceAddonsUse
        // isUsingCustom is false
    } 
    // Pinia store is not initialized
    return Default_FORCE_ADDONS_USE
}

// Max Addons of type
export function MAX_ADDONS_OF_TYPE(addontype: string) : number {
    const activePinia = getActivePinia();
    if (activePinia) {
        // Pinia store is initialized*
        const settingStore = useSettingsStore();
        if (settingStore.isUsingCustom)
            switch (addontype) {
                case Addons_TYPE.EVENT: return settingStore.EventsMax;
                case Addons_TYPE.LANDMARK: return settingStore.LandmarksMax;
                case Addons_TYPE.PROJECT: return settingStore.ProjectsMax
                case Addons_TYPE.WAY: return settingStore.WaysMax;
                case Addons_TYPE.TRAIT: return settingStore.TraitsMax;
            }
        // isUsingCustom is false
    } 
    // Pinia store is not initialized
    return Default_MAX_ADDONS_IN_KINGDOM
}