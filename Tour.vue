<template>
  <div class="my-3">
    <div v-for="(step, index) in steps" :key="index">
      <b-popover :target="step.target" :placement="step.placement" ref="steps">
        <template v-slot:title>
          <span v-if="step.title" v-html="step.title"></span>
        </template>
        <span v-if="step.content" v-html="step.content"></span>
        <div class="mt-3 mb-1">
          <b-btn variant="outline-light" @click="onSkip" class="mr-1">
            Skip tour
          </b-btn>
          <b-btn variant="outline-light" @click="onPrevious" class="ml-1 mr-1" v-if="index !== 0">
            Previous
          </b-btn>
          <b-btn variant="outline-light" @click="onNext" class="ml-1">
            <span v-if="index === (steps.length - 1)">
              Finish
            </span>
            <span v-else>
              Next
            </span>
          </b-btn>
        </div>
      </b-popover>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Tour',
  data () {
    return {
      steps: [],
      currentStep: -1,
      initialSteps: [{
        selector: '.project-cards__item',
        title: 'First step',
        content: 'This is my content',
        placement: 'top'
      }, {
        selector: '.search-layout-selector__button:nth-child(3)',
        title: 'Second step',
        content: 'This is another content',
        placement: 'top'
      }]
    }
  },
  methods: {
    async onPrevious () {
      this.$refs.steps[this.currentStep].$emit('close')
      await this.$set(this, 'currentStep', this.currentStep - 1)
      if (this.currentStep >= 0) this.$refs.steps[this.currentStep].$emit('open')
    },
    async onNext () {
      if (this.currentStep >= 0) this.$refs.steps[this.currentStep].$emit('close')
      if (this.currentStep === 0) {
        await new Promise(resolve => resolve(this.$router.push({ name: 'search', query: this.$store.getters['search/toRouteQuery']() })))
        this.initialSteps[1].target = document.querySelector(this.initialSteps[1].selector)
        this.steps.push(this.initialSteps[1])
        await this.$nextTick()
      }
      await this.$set(this, 'currentStep', this.currentStep + 1)
      if (this.currentStep < this.$refs.steps.length) this.$refs.steps[this.currentStep].$emit('open')
    },
    async onSkip () {
      if (this.currentStep >= 0) this.$refs.steps[this.currentStep].$emit('close')
      await this.$set(this, 'currentStep', -1)
    }
  },
  async mounted () {
    this.initialSteps[0].target = document.querySelector(this.initialSteps[0].selector)
    this.steps.push(this.initialSteps[0])
    this.onNext()
  }
}
</script>
