<template>
  <div class="my-3">
    <div v-for="(step, index) in steps" :key="index">
      <b-popover :target="step.target" :placement="step.placement" ref="steps">
        <template v-slot:title>
          <span v-if="step.title" v-html="step.title"></span>
        </template>
        <div v-if="step.content" v-html="step.content" class="text-center"></div>
        <div class="mt-3 mb-1 text-center">
          <b-btn variant="outline-light" @click="onSkip" class="mr-1">
            Skip tour
          </b-btn>
          <b-btn variant="outline-light" @click="onPrevious" class="ml-1 mr-1">
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
import map from 'lodash/map'

export default {
  name: 'Tour',
  data () {
    return {
      steps: [],
      currentStep: -1,
      initialSteps: [{
        selector: '.project-cards__item:nth-child(1)',
        content: 'Enter a project like Luxleaks !',
        placement: 'bottom'
      }, {
        before: () => new Promise(resolve => resolve(this.$router.push({ name: 'search' }))),
        selector: '.search-layout-selector__button:nth-child(3)',
        content: 'Use different views: List, Grid and Table.',
        placement: 'bottomleft',
        action: () => document.querySelector('.search-layout-selector__button:nth-child(3)').click()
      }, {
        selector: '.filters-panel__sticky__toolbar__toggler',
        content: 'Want to better see your documents?<br>Hide the Menu and Filters columns to make room!',
        placement: 'right'
      }, {
        selector: '.filter:nth-child(10)',
        content: 'Contextualize your filters can be useful!<br>Open Languages and select German.',
        placement: 'right',
        action: () => {
          document.querySelector('.filter:nth-child(10) h6').click()
          setTimeout(() => {
            document.querySelector('.filter:nth-child(10) .filter__items__item:nth-child(2) .custom-control-input').click()
          }, 300)
        }
      }, {
        before: () => new Promise(resolve => resolve(this.$router.push({ name: 'user-history' }))),
        selector: '.app-sidebar__container__menu__item:nth-child(4)',
        content: 'At any time, if you’re lost in your searches, go see Your History here :slight_smile:',
        placement: 'right'
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
      await this.$set(this, 'currentStep', this.currentStep + 1)
      if (this.steps[this.currentStep].before) {
        await this.steps[this.currentStep].before()
        this.updateSteps()
        await this.$nextTick()
      }
      if (this.currentStep < this.$refs.steps.length) this.$refs.steps[this.currentStep].$emit('open')
      if (this.steps[this.currentStep].action) {
        await this.steps[this.currentStep].action()
      }
    },
    async onSkip () {
      if (this.currentStep >= 0) this.$refs.steps[this.currentStep].$emit('close')
      await this.$set(this, 'currentStep', -1)
    },
    updateSteps () {
      map(this.initialSteps, step => {
        const element = document.querySelector(step.selector)
        step.target = element
        this.steps.push(step)
      })
    }
  },
  async mounted () {
    this.updateSteps()
    this.onNext()
  }
}
</script>
