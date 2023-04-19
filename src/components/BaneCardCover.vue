<template>
  <div :class="cardCover" class="card-cover">
    <div class="card-cover-div">
      <div :class="cardCoverText" class="card-cover-text">
        {{ $t(isType) }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import type { PropType } from "vue";

export default defineComponent({
  name: "BaneCardCover",
  props: {
    isType: {
      type: String,
      required: true,
    },
  },
  setup(props: { isType: string; }) {
    const cardCover = computed(() => {
      return props.isType.toLowerCase() + "-color"
    });

    const cardCoverText = computed(() => {
      return props.isType.toLowerCase() + "-color-text"
    });

    return {
      cardCover,
      cardCoverText
    }
  }
})
</script>

<style>
.bane-card-cover {
  width: 100%;
  height: 100%;
  position: absolute;
  box-sizing: border-box;
  border: 5px solid #b78eca
    /* curse-color */
  ;
}

.bane-card-cover-text {
  transform: rotate(0.75turn);
  color: white;
  background: #b78eca
    /* curse-color */
  ;
  position: absolute;
  bottom: 9px;
  right: -17px;
  padding: 6px 12px;
}

.card-cover {
  width: 100%;
  height: 100%;
  position: absolute;
  box-sizing: border-box;
}

.bane-color {
  border: 8px solid #b78eca
    /* curse-color */
  ;
}

.obelisk-color {
  border: 8px solid #55AC6A
    /* landmark-color */
  ;
}

.card-cover-div {
  position: relative;
  transform: rotate(0.75turn);
  bottom: -70%;
  right: -38%;
}

.card-cover-text {
  position: absolute;
  padding: 6px 12px;
}

.bane-color-text {
  color: white;
  background: #b78eca
    /* curse-color */
  ;

}

.obelisk-color-text {
  color: black;
  background: #55AC6A
    /* curse-color */
  ;
}

@media (max-width: 600px) {
  .card-cover {
    border-width: 3px;
  }

  .card-cover-text {
    font-size: 12px;
    right: -13px;
  }
}</style>