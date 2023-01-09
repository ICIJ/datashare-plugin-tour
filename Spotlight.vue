<script>
export default {
  name: 'Spotlight',
  props: {
    target: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      resizeKey: 1
    }
  },
  created() {
    window.addEventListener("resize", this.generateResizeKey);
  },
  destroyed() {
    window.removeEventListener("resize", this.generateResizeKey);
  },
  computed: {
    targetBoundingClientRect () {
      return this.resizeKey ? this.target.getBoundingClientRect() : {}
    },
    style () {
      const { top = 0, left = 0, width = 0 } = this.targetBoundingClientRect
      const circleLeft = left + width / 2
      const circleTop = top + width / 2
      const circleDiameter = width * 2
      const circleStartColor = 'transparent'
      const circleStopColor = 'var(--darkest)'
      const backgroundImage = `radial-gradient(circle at ${circleLeft}px ${circleTop}px, ${circleStartColor} 0%, ${circleStopColor} ${circleDiameter}px, ${circleStopColor} 100%)`
      return  { backgroundImage }
    }
  },
  methods: {
    generateResizeKey () {
      this.resizeKey++
    }
  }
}
</script>

<template>
  <div class="spotlight" :style="style" v-if="target" />
</template>

<style>
  .spotlight {
    background: no-repeat transparent 0 0;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    top: 0;
    z-index: 1020;
    opacity: 0.7;
  }
</style>
