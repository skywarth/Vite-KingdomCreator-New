<template>
  <div :class="cardCover" class="card-cover">
    <div :class="cardDiv" class="card-cover-div">
      <div :class="cardCoverText" class="card-cover-text">
        {{ $t(isType) }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
/* import Vue, typescript */
import { defineComponent, computed } from "vue";

/* import Dominion Objects and type*/
/* import store  */
/* import Components */

const ANIMATION_DURATION_SEC = 0.6;
const WINDOW_RESIZE_DELAY_MSEC = 300;

export default defineComponent({
  name: "BaneCardCover",
  props: {
    isType: {
      type: String,
      required: true,
    },
  },
  setup(props: { isType: string; }) {
    const cardDiv = computed(() => {
      return props.isType.toLowerCase() + "-div"
    });

    const cardCover = computed(() => {
      return props.isType.toLowerCase() + "-color"
    });

    const cardCoverText = computed(() => {
      return props.isType.toLowerCase() + "-color-text"
    });

    return {
      cardCover,
      cardDiv,
      cardCoverText
    }
  }
})
</script>

<style>

.card-cover {
  width: 100%;
  height: 100%;
  position: absolute;
  box-sizing: border-box;
  /* display: flex; */
}

.card-cover-div {
  position:inherit;
  display: flex;
  transform: rotate(+0.75turn);
  align-self: flex-end;
  right: 0%;
  flex-direction: column-reverse;
  bottom:10%;
}
.bane-div{
  bottom: 10%;
}
.obelisk-div{
  bottom: 20%;
}
.mouseway-div{
  bottom: 10%;
}

.card-cover-text {
  position: absolute;
  padding: 6px 12px;
}

.bane-color {
  border: 8px solid #b78eca   /* curse-color */;
}
.bane-color-text {
  color: white;
  background: #b78eca        /* curse-color */;
}

.obelisk-color {
  border: 8px solid #7db68d /* landmark-color */;
}

.obelisk-color-text {
  color: black;
  background: #7db68d       /* Landmark-color */;
}

.mouseway-color {
  border: 8px solid #bad4eb /* mouseway-color */;
}
.mouseway-color-text {
  color: black;
  background: #bad4eb       /* mouseway-color */;
}


@media (max-width: 600px) {
  .card-cover {
    border-width: 3px;
  }

  .card-cover-text {
    font-size: 12px;
    right: -13px;
  }
}

</style>