<template>
  <div>
    <spotlight :target="currentStepTarget" v-if="isStarted" :key="currentStepTarget" />
    <div v-for="(step, index) in steps" :key="index">
      <b-popover :target="step.target" :placement="step.placement" ref="steps" customClass="tour-step popover-magnified-info">
        <div v-if="step.content" v-html="step.content"></div>
        <div class="mt-4 mb-1 d-flex">
          <b-btn v-if="step.title" @click="onFinish" variant="link" class="text-light ml-auto mr-1">
            Skip tour
          </b-btn>
          <b-btn @click="onPrevious" v-if="index !== 0" variant="light" class="font-weight-bold mr-1">
            Back
          </b-btn>
          <b-btn @click="onFinish" v-if="index === (steps.length - 1)" variant="light" class="font-weight-bold mr-1">
            Finish
          </b-btn>
          <b-btn @click="onNext" v-else variant="light" class="font-weight-bold">
            Continue
          </b-btn>
        </div>
      </b-popover>
    </div>
  </div>
</template>

<script>
import { isNull, map } from 'lodash'
import Spotlight from './Spotlight.vue'

const STORAGE_NAME = '_ds_plugin_tour'

export default {
  name: 'Tour',
  components: {
    Spotlight
  },
  data () {
    return {
      isStarted: false,
      steps: [],
      currentStep: -1,
      initialSteps: [{
        selector: '.project-cards__item:nth-child(1)',
        title: 'Projects',
        content: 'Enter a project, such as Luxleaks!',
        placement: 'bottom',
        page: 'landing'
      }, {
        before: () => this.$store.commit('search/resetFilterValues'),
        selector: '.search-layout-selector__button:nth-child(3)',
        title: 'Views',
        content: 'Try different layouts: list, grid and table.',
        placement: 'bottomleft',
        page: 'search',
        action: () => document.querySelector('.search-layout-selector__button:nth-child(3)').click()
      }, {
        selector: '.filters-panel__sticky__toolbar__toggler',
        title: 'Menus',
        content: 'Make room by hiding the menu and filters columns!',
        placement: 'right',
        page: 'search'
      }, {
        selector: '.filter:nth-child(8)',
        title: 'Filters',
        content: 'Filter your documents. For example, select German.',
        placement: 'right',
        page: 'search',
        action: () => {
          document.querySelector('.filter:nth-child(8) h6').click()
          setTimeout(() => {
            document.querySelector('.filter:nth-child(8) .filter__items__item:nth-child(3) .custom-control-input').click()
          }, 800)
        }
      }, {
        selector: '.filter:nth-child(8)',
        title: 'Filters',
        content: 'If you click Contextualize, the search result count for this filter will be updated.',
        placement: 'right',
        page: 'search',
        action: () => {
          setTimeout(() => {
            document.querySelector('.filter:nth-child(8) .filter__footer__action--contextualize .custom-control-input').click()
          }, 500)
        }
      }, {
        selector: '.app-sidebar__container__menu__item:nth-child(3)',
        title: 'History',
        content: 'Lost in your searches? Browse your history here!',
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
    open(){
      this.$refs.steps?.[this.currentStep]?.$emit('open')
    },
    close(){
      this.$refs.steps?.[this.currentStep]?.$emit('close')
    },
    async onPrevious () {
      this.close()
      await this.$set(this, 'currentStep', this.currentStep - 1)
      if (this.currentStep >= 0) {
        await this.goToPage(this.steps[this.currentStep].page)
        this.open()
      }
    },
    async onNext () {
      this.close()
      await this.$set(this, 'currentStep', this.currentStep + 1)
      if (this.currentStep < this.$refs.steps?.length && this.currentStep >= 0) {
        await this.goToPage(this.steps[this.currentStep].page)
        if (this.steps[this.currentStep].before) {
          await this.steps[this.currentStep].before()
          this.updateSteps()
          await this.$nextTick()
        }
        this.$refs.steps?.[this.currentStep]?.$emit('open')
        if (this.steps[this.currentStep].action) {
         await this.steps[this.currentStep].action()
        }
      }
    },
    async onFinish () {
      this.close()
      this.$set(this, 'isStarted', false)
      this.$set(this, 'currentStep', -1)
      this.$set(this, 'steps', [])
      localStorage.setItem(STORAGE_NAME, "true")
    },
    updateSteps () {
      this.$set(this, 'steps', [])
      map(this.initialSteps, step => {
        step.target = document.querySelector(step.selector)
        this.steps.push(step)
      })
    }
  },
  computed: {
    currentStepTarget () {
      return this.isStarted ? this.steps[this.currentStep]?.target : null
    }
  },
  mounted () {
    if(isNull(localStorage.getItem(STORAGE_NAME))) {
      this.$set(this, 'isStarted', true)
      this.updateSteps()
      this.onNext()
    }
  }
}
</script>

<!-- Can not be scoped since popovers are created outside the component -->
<style>
  .tour-step {
    color: #fff;
    font-size: 1.1rem;
    width: 400px;
  }
</style>
