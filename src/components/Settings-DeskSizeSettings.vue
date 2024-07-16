<template>
  <div class="DeskSize">
    <div class="SettingTitle">Desk Size Setting</div>
    <div class="llevel1-div">
      <div class="llevel2-div">
        <SwitchGroup as="div" class="llevel3-Switch switchGroupcss">
          <SwitchLabel>Use Custom Configuration for DeckSize</SwitchLabel>
          <Switch as="button" v-model="isUsingCustom" v-slot="{ checked }" :class="isUsingCustom ? 'switch-bg-indigo-600' : 'switch-bg-gray-200'"
            class="relative-switchcss">
            <span class="SwitchSpan" :class="{ 'translate-x-5': checked, 'translate-x-0': !checked }" />
          </Switch>
        </SwitchGroup>
      </div>
    </div>
    <div class="custom-settings">
      <div class="slider-container kingdomSize">
        <label class="kingdomlabel-settings" for="kingdomNb">NB of kingdom for the Game</label>
        <input class="kingdomInput" type="number" id="kingdomNb" v-model="KingdomNb" />
      </div> 
    </div>
    <div class="custom-settings">
      <div class="slider-container">
        <label class="label-settings" for="addons">Addons</label>
        <input type="range" id="addons" v-model="AddonsNb" min="0" max="5" />
        <span class="addon-value">{{ AddonsNb }}</span>
      </div>

      <div class="slider-container">
        <label class="label-settings indented" for="events">Events</label>
        <input type="range" id="events" v-model="EventsMax" min="0" max="5" />
        <span class="addon-value">{{ EventsMax }}</span>
      </div>

      <div class="slider-container">
        <label class="label-settings indented" for="landmarks">Landmarks</label>
        <input type="range" id="landmarks" v-model="LandmarksMax" min="0" max="5" />
        <span class="addon-value">{{ LandmarksMax }}</span>
      </div>

      <div class="slider-container">
        <label class="label-settings indented" for="projects">Projects</label>
        <input type="range" id="projects" v-model="ProjectsMax" min="0" max="5" />
        <span class="addon-value">{{ ProjectsMax }}</span>
      </div>

      <div class="slider-container">
        <label class="label-settings indented" for="ways">Ways</label>
        <input type="range" id="ways" v-model="WaysMax" min="0" max="5" />
        <span class="addon-value">{{ WaysMax }}</span>
      </div>
<p></p>
      <div class="slider-container">
        <label class="label-settings" for="traits">Traits</label>
        <input type="range" id="traits" v-model="TraitsMax" min="0" max="5" style="color:blue;"/>
        <span class="addon-value">{{ TraitsMax }}</span>

      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from "vue";
import { SwitchGroup, SwitchLabel, Switch } from "@headlessui/vue";
import { useSettingsStore } from "../pinia/settings-store";

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

    const updateStoreValues = () => {
      SettingsStore.updateSettings({
        KingdomNb: KingdomNb.value,
        AddonsNb: AddonsNb.value,
        EventsMax: EventsMax.value,
        LandmarksMax: LandmarksMax.value,
        ProjectsMax: ProjectsMax.value,
        WaysMax: WaysMax.value,
        TraitsMax: TraitsMax.value,
      });
    };

    watch(
      [KingdomNb, AddonsNb, EventsMax, LandmarksMax, ProjectsMax, WaysMax, TraitsMax],
      updateStoreValues,
      { deep: true } // Ensure deep watch to catch nested changes
    );
    return {
      isUsingCustom,
      KingdomNb,
      AddonsNb,
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
  width: 30%;
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
}

.kingdomSize{
  display: flex;
}

.kingdomSize label {
  flex-basis: 650%;
}
.kingdomSize input {
  flex-grow: 1;
}

.kingdomInput {
  text-align: end;
}

.label-settings{
  width: 75%;
}

.label-settings.indented {
  margin-left: 20px; /* Indent the text to the left */
  margin-right: -20px;
}

.slider-container {
  display: flex;
  flex-direction: row; /* Stack items vertically */
  align-items: flex-start; /* Align items to the left */
  gap: 0.5rem; /* Add a small gap between label and slider */
  justify-content: flex-end;
}

.slider-container input {
  width: 100%; /* Make the input span the full width of the container */
  margin-top: 0; /* Remove default margin-top */
}


</style>
