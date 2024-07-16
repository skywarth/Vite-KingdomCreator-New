<template>

  <div class="level1-div">
    <div class="level2-div">
      <SwitchGroup as="div" class="level3-Switch switchGroupcss">
        <SwitchLabel>Enable notifications</SwitchLabel>

        <Switch as="button" v-model="switchValue" v-slot="{ checked }" :class="switchValue ? 'switch-bg-indigo-600' : 'switch-bg-gray-200'"
          class="relative-switchcss">
          <span
            class="SwitchSpan "
            :class="{ 'translate-x-5': checked, 'translate-x-0': !checked }"
          />
        </Switch>
      </SwitchGroup>
    </div>
  </div>
</template>

<script  lang="ts">
import { defineComponent, ref } from 'vue';
import { SwitchGroup, Switch, SwitchLabel } from "@headlessui/vue";

export default defineComponent({
  name: "OwnedExpansionsSettings",
  components: {
    SwitchGroup,
    Switch,
    SwitchLabel,
  },
  setup() {
    const switchValue = ref(false);
    const enabled = ref(true);

    return {
      switchValue,
      enabled
    };
  },
});
</script>

<style scoped>

.flex-center {
  display: flex;
  align-items: center;
}

.level1-div {
  padding: 3rem;
  justify-content: center;
  align-items: center;
  display: flex;
}

.level2-div {
  width: 100%;
  max-width: 20rem;
  margin-left: auto;
  margin-right: auto;
}

.level3-Switch {
  align-items: center;
  display: flex;
}

</style>