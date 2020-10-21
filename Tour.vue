<template>
  <div class="my-3">
    <div v-for="(step, index) in steps" :key="index">
      <b-popover :target="step.target" :placement="step.placement" ref="steps" customClass="tour-step">
        <template v-slot:title>
          <span v-if="step.title" v-html="step.title"></span>
          <b-btn v-if="step.title" class="float-right py-0" @click="onFinish">
            x
          </b-btn>
        </template>
        <div v-if="step.content" v-html="step.content"></div>
        <div class="mt-4 mb-1 text-center">
          <b-btn-group>
            <b-btn @click="onPrevious" v-if="index !== 0">
              Previous
            </b-btn>
            <b-btn @click="onFinish" v-if="index === (steps.length - 1)">
              Finish
            </b-btn>
            <b-btn @click="onNext" v-else>
              Next
            </b-btn>
          </b-btn-group>
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
        title: 'Projects',
        content: 'Enter a project like Luxleaks !',
        placement: 'bottom',
        page: 'landing'
      }, {
        before: () => {
          return this.$store.commit('search/resetFilterValues')
        },
        selector: '.search-layout-selector__button:nth-child(3)',
        title: 'Views',
        content: 'Use different views: List, Grid and Table.',
        placement: 'bottomleft',
        page: 'search',
        action: () => document.querySelector('.search-layout-selector__button:nth-child(3)').click()
      }, {
        selector: '.filters-panel__sticky__toolbar__toggler',
        title: 'Menus',
        content: 'Want to better see your documents?<br>Hide the Menu and Filters columns to make room!',
        placement: 'right',
        page: 'search'
      }, {
        selector: '.filter:nth-child(10)',
        title: 'Filters',
        content: 'Contextualize your filters can be useful!<br>Open Languages and select German.',
        placement: 'right',
        page: 'search',
        action: () => {
          document.querySelector('.filter:nth-child(10) h6').click()
          setTimeout(() => {
            document.querySelector('.filter:nth-child(10) .filter__items__item:nth-child(3) .custom-control-input').click()
          }, 300)
        }
      }, {
        selector: '.app-sidebar__container__menu__item:nth-child(4)',
        title: 'History',
        content: 'At any time, if you’re lost in your searches, go see Your History here',
        placement: 'right',
        page: 'user-history'
      }]
    }
  },
  methods: {
    async goToPage (pageName) {
      if (pageName) {
        const currentName = this.$router.currentRoute.name
        if (currentName !== pageName) {
          await this.$router.push({ name: pageName })
          this.updateSteps()
          await this.$nextTick()
        }
      }
    },
    async onPrevious () {
      this.$refs.steps[this.currentStep].$emit('close')
      await this.$set(this, 'currentStep', this.currentStep - 1)
      if (this.currentStep >= 0) {
        await this.goToPage(this.steps[this.currentStep].page)
        this.$refs.steps[this.currentStep].$emit('open')
      }
    },
    async onNext () {
      if (this.$refs.steps && this.$refs.steps[this.currentStep]) this.$refs.steps[this.currentStep].$emit('close')
      await this.$set(this, 'currentStep', this.currentStep + 1)
      if (this.currentStep < this.$refs.steps.length) {
        await this.goToPage(this.steps[this.currentStep].page)
        if (this.steps[this.currentStep].before) {
          await this.steps[this.currentStep].before()
          this.updateSteps()
          await this.$nextTick()
        }
        this.$refs.steps[this.currentStep].$emit('open')
        if (this.steps[this.currentStep].action) {
          await this.steps[this.currentStep].action()
        }
      }
    },
    async onFinish () {
      if (this.currentStep >= 0) this.$refs.steps[this.currentStep].$emit('close')
      this.$set(this, 'currentStep', -1)
    },
    updateSteps () {
      this.$set(this, 'steps', [])
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

<style lang="scss">
.tour-step {
  .popover-body,
  .popover-header {
    background-color: #1a1a1e;
    border-radius: 0;
    padding: 1rem 1.5rem;

    .btn {
      background-color: transparent;
      border-color: transparent;

      &:hover {
        background-color: #25252a;
      }
    }
  }

  .popover-header {
    font-size: large;
    padding-bottom: 0;
  }

  .popover-body {
    .btn {
      background-color: #25252a;
      margin-right: 5px;
    }
  }

  .popover.bs-popover-auto[x-placement^="bottom"] > .arrow::after,
  .popover.bs-popover-bottom > .arrow::after {
    border-bottom-color: #1a1a1e;
  }

  .bs-popover-auto[x-placement^="right"] > .arrow::after,
  .bs-popover-auto[x-placement^="right"] > .arrow::before,
  .bs-popover-right > .arrow::after,
  .bs-popover-right > .arrow::before {
    border-right-color: #1a1a1e;
  }
}
</style>
