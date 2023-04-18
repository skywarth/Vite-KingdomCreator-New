<template>
  <div v-if="items.length">
    <div class="preset-kingdom__addon-title">{{title}}</div> 
      <GridLayout
        v-if="items.length"
        :items="items"
        :number-of-columns="genericNbColumns"
        :is-vertical="isVertical"
        :shape="shape"
      >
        <template v-slot:default="slotProps">
          <StaticCardWithSet
            :card="slotProps.item"
            :is-vertical="false"
            :showOverlay="showOverlay"
          />
        </template>
    </GridLayout>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, computed } from 'vue';
import GridLayout , { Shape }from "./GridLayout.vue";
import StaticCardWithSet from "./StaticCardWithSet.vue";
import { useWindowStore } from '../pinia/window-store';

export default defineComponent({
  name: "GenericLayout",
  components: {
    GridLayout,
    StaticCardWithSet
  },
  props: {
    items: {
      type: Array as PropType<any[]>,
      required: true
    },
    genericNbColumns: {
      type: Number,
      required: true
    },
    isVertical: {
      type: Boolean,
      required: true
    },
    shape: {
      type: String as PropType<Shape>,
      default: Shape.CARD,
    },
    showOverlay: {
      type: Boolean,
      required: true
    },
    title: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const windowStore = useWindowStore();
    
    const windowWidth = computed(() => windowStore.width);
    const isEnlarged = computed(() => windowStore.isEnlarged);

    return {
      windowWidth,
      isEnlarged
    }
  }
});
</script>

<style>
@media (max-width: 450px) {
  .preset-kingdom_title_name {
    font-size: 30px;
    margin-right: 8px;
  }
    
  .preset-kingdom_set-name {
    font-size: 14px;
    padding: 4px 6px;
  }
}

</style>