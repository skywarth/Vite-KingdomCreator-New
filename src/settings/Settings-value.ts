import { getActivePinia } from 'pinia'; // Import Pinia
import { useSettingsStore } from '../pinia/settings-store';

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