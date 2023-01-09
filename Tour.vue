<template>
  <div>
    <spotlight v-if="isStarted" :key="currentStepTarget" :target="currentStepTarget"/>
    <div v-for="(step, index) in initialSteps" :key="index">
      <b-popover ref="steps" :placement="step.placement" :target="currentStepTarget"
                 customClass="tour-step popover-magnified-info">
        <div v-if="step.content" v-html="step.content"></div>
        <div class="mt-4 mb-1 d-flex">
          <b-btn v-if="step.title" class="text-light ml-auto mr-1" variant="link" @click="onFinish">
            Skip tour
          </b-btn>
          <b-btn v-if="index !== 0" class="font-weight-bold mr-1" variant="light" @click="onPrevious">
            Back
          </b-btn>
          <b-btn v-if="index === (initialSteps.length - 1)" class="font-weight-bold mr-1" variant="light"
                 @click="onFinish">
            Finish
          </b-btn>
          <b-btn v-else class="font-weight-bold" variant="light" @click="onNext">
            Continue
          </b-btn>
        </div>
      </b-popover>
    </div>
  </div>
</template>

<script>
import {isNull} from 'lodash'
import Spotlight from './Spotlight.vue'

const STORAGE_NAME = '_ds_plugin_tour'

export default {
  name: 'Tour',
  components: {
    Spotlight
  },
  data() {
    return {
      isStarted: false,
      currentStep: 0,
      initialSteps: [{
        before: () => {
          this.$store.commit('search/resetFilterValues')
          this.$store.commit('search/decontextualizeFilter','language')
        },
        selector: '.project-cards__item:nth-child(1)',
        title: 'Projects',
        content: 'Enter a project, such as Luxleaks!',
        placement: 'bottom',
        page: 'landing',
        clean: ()=>{}
      }, {
        selector: '.search-layout-selector__button:nth-child(3)',
        title: 'Views',
        content: 'Try different layouts: list, grid and table.',
        placement: 'bottomleft',
        page: 'search',
        clean: ()=>{},
        action: () => {
          document.querySelector('.search-layout-selector__button:nth-child(3)').click()
        }
      }, {
        selector: '.filters-panel__sticky__toolbar__toggler',
        title: 'Menus',
        content: 'Make room by hiding the menu and filters columns!',
        placement: 'right',
        page: 'search',
        clean: ()=>{ }
      }, {
        selector: '.filter:nth-child(8)',
        title: 'Filters',
        content: 'Filter your documents. For example, select German.',
        placement: 'right',
        page: 'search',
        clean: ()=>{
          this.$store.commit('search/resetFilterValues')
          document.querySelector('.filter:nth-child(8) h6').click()
        },
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
        clean: ()=>{
          this.$store.commit('search/resetFilterValues')
          this.$store.commit('search/decontextualizeFilter','language')
          document.querySelector('.filter:nth-child(8) h6').click()
        },
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
        page: 'user-history',
        clean: ()=>{}
      }]
    }
  },
  methods: {
    openPopover() {
      this.$refs.steps[this.currentStep].$emit('open')
    },
    closePopover() {
      this.$refs.steps[this.currentStep].$emit('close')
    },
    async onPrevious() {
      this.closePopover()
      const stepNumber = Math.max(this.currentStep - 1, 0)
      await this.goToPage(stepNumber)
      //clean search state
      this.actualStep.clean()
      await this.renderStep(stepNumber)
    },
    async onNext() {
      const stepNumber = Math.min(this.currentStep + 1, this.initialSteps.length - 1)
      this.closePopover()
      await this.goToPage(stepNumber)
      // need to wait the page to be loaded before rendering the new step
      await this.renderStep(stepNumber)
    },
    async onFinish() {
      this.closePopover()
      this.isStarted = false
      localStorage.setItem(STORAGE_NAME, "true")
    },
    async goToPage(stepNumber) {
      const pageName = this.initialSteps[stepNumber].page
      if (pageName) {
        const currentName = this.$router.currentRoute.name
        if (currentName !== pageName) {
          await this.$router.push({name: pageName})
          await this.$nextTick()
        }
      }
    },
    async renderStep(stepNumber) {
      this.currentStep = stepNumber
      if (this.actualStep.before) {
        await this.actualStep.before()
      }
      await this.$nextTick()
      this.openPopover()
      if (this.actualStep.action) {
        await this.actualStep.action()
      }
    }
  },
  computed: {
    actualStep() {
      return this.initialSteps[this.currentStep]
    },
    currentStepTarget() {
      const target = document.querySelector(this.actualStep.selector)
      return this.isStarted ? target : null
    }
  },
  async mounted() {
    if (isNull(localStorage.getItem(STORAGE_NAME))) {
      this.closePopover()
      await this.goToPage(this.currentStep)
      this.isStarted = true
      await this.renderStep(this.currentStep)
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
