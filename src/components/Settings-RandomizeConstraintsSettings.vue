<template>
    <div>
        <h2 class="title">Desk Size Setting</h2>
        <hr class="underline" />
        <div class="toggle-container">
            <span>Standard</span>
            <label class="switch">
                <input type="checkbox" v-model="isCustom" />
                <span class="slider"></span>
            </label>
            <span>Custom</span>
        </div>
        <div v-if="isCustom" class="custom-settings">
            <label for="kingdomNb">Kingdom Nb</label>
            <input type="number" id="kingdomNb" v-model="kingdomNb" />
            <div class="addons-container">
                <label for="minAddon">Min Addons</label>
                <input type="range" id="minAddon" v-model="minAddon" min="0" max="10" />
                <span class="addon-value">{{ minAddon }}</span>
            </div>
            <div class="addons-container">
                <label for="maxAddon">Max Addons</label>
                <input type="range" id="maxAddon" v-model="maxAddon" min="0" max="10" />
                <span class="addon-value">{{ maxAddon }}</span>
            </div>
        </div>
    </div>
</template>


<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: "DeskSizeSettings",

  setup() {
    return {
      isCustom: false,
      kingdomNb: 10,
      minAddon: 0,
      maxAddon: 10,
    };
  }
});

</script>

