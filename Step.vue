<template>
  <div class="text-center my-3">
    <b-popover :target="steps[0].target" :placement="steps[0].placement" ref="popover-0" v-if="steps.length">
      <template v-slot:title>
        <span v-if="steps[0].title" v-html="steps[0].title"></span>
      </template>
      <span v-if="steps[0].content" v-html="steps[0].content"></span>
    </b-popover>
    <b-popover :target="steps[1].target" :placement="steps[1].placement" ref="popover-1" v-if="steps[1]">
      <template v-slot:title>
        <span v-if="steps[1].title" v-html="steps[1].title"></span>
      </template>
      <span v-if="steps[1].content" v-html="steps[1].content"></span>
    </b-popover>
  </div>
</template>

<script>
export default {
  name: 'Popover',
  data () {
    return {
      steps: []
    }
  },
  async mounted () {
    const steps = [{
      target: document.querySelector('.project-cards__item'),
      title: 'First step',
      content: 'This is my content',
      placement: 'top'
    }, {
      target: document.querySelector('.search-bar__submit'),
      title: 'Second step',
      content: 'This is another content',
      placement: 'top'
    }]
    await this.$set(this, 'steps', steps)
    this.$refs['popover-0'].$emit('open')
    this.$refs['popover-1'].$emit('open')
  }
}
</script>
