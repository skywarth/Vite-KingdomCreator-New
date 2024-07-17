<template>
  <div class="DeskSize">
    <div class="SettingTitle">{{ $t("Desk Size Setting") }}</div>
    <div class="llevel1-div">
      <div class="llevel2-div">
        <SwitchGroup as="div" class="llevel3-Switch switchGroupcss">
          <SwitchLabel>{{ $t("Use Custom Configuration for DeckSize") }}</SwitchLabel>
          <Switch as="button" v-model="isUsingCustom" v-slot="{ checked }" :class="isUsingCustom ? 'switch-bg-indigo-600' : 'switch-bg-gray-200'"
            class="relative-switchcss">
            <span class="SwitchSpan" :class="{ 'translate-x-5': checked, 'translate-x-0': !checked }" />
          </Switch>
        </SwitchGroup>
      </div>
    </div>
    <div class="custom-settings">
      <div class="slider-container kingdomSize">
        <label class="kingdomlabel-settings" for="kingdomNb">{{ $t("NB of kingdom for the Game") }}</label>
        <input class="kingdomInput" type="number" id="kingdomNb" v-model="KingdomNb" />
      </div> 
    </div>
    <div class="custom-settings">
      <div class="slider-container">
        <label class="label-settings" for="addons">{{ $t("Addons") }}</label>
        <input class="labbel-settings"  type="range" id="addons" v-model="AddonsNb" min="0" max="8" />
        <span class="addon-value">{{ AddonsNb }}</span>
      </div>
      <div class="slider-container slidercheckbox">
        <label class="label-settings indentedCheckbox" for="addons">{{ $t("Force Addons usage") }}</label>
        <input class="label-settings check-settings" type="checkbox" id="addons" v-model="forceAddonsUse" />
      </div>

      <div class="slider-container">
        <label class="label-settings indented" for="events">{{ $t("Events") }}</label>
        <input class="label-settings"  type="range" id="events" v-model="EventsMax" min="0" max="8" />
        <span class="addon-value">{{ EventsMax }}</span>
      </div>
      <div class="slider-container">
        <label class="label-settings indented" for="landmarks">{{ $t("Landmarks") }}</label>
        <input class="label-settings" type="range" id="landmarks" v-model="LandmarksMax" min="0" max="8" />
        <span class="addon-value">{{ LandmarksMax }}</span>
      </div>
      <div class="slider-container">
        <label class="label-settings indented" for="projects">{{ $t("Projects") }}</label>
        <input class="label-settings" type="range" id="projects" v-model="ProjectsMax" min="0" max="8" />
        <span class="addon-value">{{ ProjectsMax }}</span>
      </div>
      <div class="slider-container">
        <label class="label-settings indented" for="ways">{{ $t("Ways") }}</label>
        <input class="label-settings" type="range" id="ways" v-model="WaysMax" min="0" max="8" />
        <span class="addon-value">{{ WaysMax }}</span>
      </div>
      <div class="slider-container">
        <label class="label-settings indented" for="traits">{{ $t("Traits") }}</label>
        <input class="label-settings" type="range" id="traits" v-model="TraitsMax" min="0" max="8" style="color:blue;"/>
        <span class="addon-value">{{ TraitsMax }}</span>

      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from "vue";
import { SwitchGroup, SwitchLabel, Switch } from "@headlessui/vue";
import { useSettingsStore } from "../pinia/settings-store";
import { useI18n } from 'vue-i18n'

export default defineComponent({
  name: "DeskSizeSettings",
  components: {
    Switch,
    SwitchLabel,
    SwitchGroup,
  },
  setup() {
    const SettingsStore = useSettingsStore();
    const isUsingCustom = ref(SettingsStore.isUsingCustom);
  
    const KingdomNb = ref(SettingsStore.KingdomNb);
    const AddonsNb = ref(SettingsStore.AddonsNb);
    const EventsMax = ref( SettingsStore.EventsMax);
    const LandmarksMax = ref( SettingsStore.LandmarksMax);
    const ProjectsMax = ref(SettingsStore.ProjectsMax);
    const WaysMax = ref(SettingsStore.WaysMax);
    const TraitsMax = ref(SettingsStore.TraitsMax);
    const forceAddonsUse = ref(SettingsStore.forceAddonsUse)

    watch(AddonsNb,
      () => {
        if (AddonsNb.value < EventsMax.value) EventsMax.value = AddonsNb.value
        if (AddonsNb.value < LandmarksMax.value) LandmarksMax.value = AddonsNb.value
        if (AddonsNb.value < ProjectsMax.value) ProjectsMax.value = AddonsNb.value
        if (AddonsNb.value < WaysMax.value) WaysMax.value = AddonsNb.value
        if (AddonsNb.value < TraitsMax.value) TraitsMax.value = AddonsNb.value
      },
      { immediate: true } // Trigger calculation on initial render
    );

   // Watch for changes in Max values and update AddonsNb if needed
   watch(
      [EventsMax, LandmarksMax, ProjectsMax, WaysMax, TraitsMax],
      () => {
        const minAddonsNb = Math.max(EventsMax.value, LandmarksMax.value, ProjectsMax.value, WaysMax.value, TraitsMax.value)
        if (AddonsNb.value < minAddonsNb) {
          AddonsNb.value = minAddonsNb; // Set to minimum allowed value
        }
      },
      { immediate: true } // Trigger calculation on initial render
    );

    const updateStoreValues = () => {
      SettingsStore.updateSettings({
        isUsingCustom: isUsingCustom.value,
        KingdomNb: KingdomNb.value,
        AddonsNb: AddonsNb.value,
        forceAddonsUse : forceAddonsUse.value,
        EventsMax: EventsMax.value,
        LandmarksMax: LandmarksMax.value,
        ProjectsMax: ProjectsMax.value,
        WaysMax: WaysMax.value,
        TraitsMax: TraitsMax.value,
      });
    };

    watch(
      [isUsingCustom, KingdomNb, AddonsNb, forceAddonsUse, EventsMax, LandmarksMax, ProjectsMax, WaysMax, TraitsMax],
      updateStoreValues,
    );
    return {
      isUsingCustom,
      KingdomNb,
      AddonsNb,
      forceAddonsUse,
      EventsMax,
      LandmarksMax,
      ProjectsMax,
      WaysMax,
      TraitsMax
    };
  },
});
</script>

<style scoped>
.DeskSize {
  margin-left: 50px;
  width: 35%;
  border-right: 2px solid black; /* Replace #000 with your desired border color */
}

.SettingTitle {
  font-size: 24px;
  font-weight: bold;
  padding: 10px;
  margin: 8px;
  border-bottom: 1px solid #ccc;
}

.llevel1-div {
  padding: 1rem 1rem 1rem 0.5rem;
  justify-content: center;
  align-items: center;
  display: flex;
}

.llevel2-div {
  width: 100%;
  max-width: 80%;
  margin-left: auto;
  margin-right: auto;
}

.llevel3-Switch {
  align-items: center;
  display: flex;
}

.custom-settings {
  padding: 0 2rem 0 1.5rem;
  margin: 1rem 0 0.5rem 0
}

.kingdomSize{
  display: flex;
}

.kingdomSize label {
  flex-basis: 500%;
}
.kingdomSize input {
  flex-grow: 1;
}

.kingdomInput {
  text-align: end;
}

.label-settings{
  width: 75%;
  align-self: center;
}


.label-settings.indented {
  margin-left: 20px; /* Indent the text to the left */
  margin-right: -20px;
}

.label-settings.indentedCheckbox {
  margin-left: 6rem; /* Indent the text to the left */
  margin-right: 0px;
 /* margin-top: -10px; */
}

.label-settings.check-settings {
  align-self: center;
  width: 6rem;
}

.slider-container {
  display: flex;
  flex-direction: row; /* Stack items vertically */
  align-items: flex-start; /* Align items to the left */
  gap: 0.5rem; /* Add a small gap between label and slider */
  justify-content: flex-end;
  margin-block: 4px;
}

.slider-container.slidercheckbox {
  width: unset; 
  margin-top: 0; /* Remove default margin-top */
}

.slider-container input {
  width: 100%; /* Make the input span the full width of the container */
  margin-top: 0; /* Remove default margin-top */
}

/* New rule for indented container */
.slider-container.indented {
  justify-content: flex-start; /* Align content (including label) to the left */
  margin-left: 20px; /* Indent the entire container to the right */
}

.slider-container.indented .label-settings {
  /* Optionally remove indentation from the label within the indented container */
  margin-left: 0;
}

</style>
