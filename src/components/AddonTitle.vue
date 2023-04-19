<template>
  <span v-if="addons.length == 0"></span>
  <span v-else-if="addons.length == 1">
    <template>
    {{ $t(addons[0]) }}
  </template>
  </span>
  <span v-else-if="addons.length >= 2" :path="addonFormat" tag="span">
  <template>
    {{ $t(addons[0]) }}
  </template>
    <template>
    {{ $t(addons[1]) }}
  </template>
    <span v-if="addons.length >= 3">
    <template>
      {{ $t(addons[2]) }}
    </template>
    </span>
    <span v-if="addons.length >= 4">
    <template>
      {{ $t(addons[3]) }}
    </template>
    </span>
    <span v-if="addons.length >= 5">
    <template>
      {{ $t(addons[4]) }}
    </template>
    </span>
  </span>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import { useI18n } from "vue-i18n";
import type { PropType } from "vue";

export default defineComponent({
  name: "AddonTitle",
  props: {
    hasEvents: {
      type: Boolean as PropType<Boolean>,
      required: true,
    },
    hasLandmarks: {
      type: Boolean as PropType<Boolean>,
      required: true,
    },
    hasProjects: {
      type: Boolean as PropType<Boolean>,
      required: true,
    },
    hasWays: {
      type: Boolean as PropType<Boolean>,
      required: true,
    },
    hasTraits: {
      type: Boolean as PropType<Boolean>,
      required: true,
    },
  },
  setup(props) {
    const { t } = useI18n();
    const addons = computed(() => {
      const addons = [];
      if (props.hasEvents) addons.push("addon_events");
      if (props.hasLandmarks) addons.push("addon_landmarks");
      if (props.hasProjects) addons.push("addon_projects");
      if (props.hasWays) addons.push("addon_ways");
      if (props.hasTraits) addons.push("addon_traits");
      return addons;
    });

    const addonFormat = computed(() => {
      switch (addons.value.length) {
        case 2:
          return "addon_description_format_2";
        case 3:
          return "addon_description_format_3";
        case 4:
          return "addon_description_format_4";
        case 5:
          return "addon_description_format_5";
        default:
          return null;
      }
    });
    return {
      addons,
      addonFormat
    };
  },
})
</script>
