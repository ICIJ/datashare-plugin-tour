<template>
  <div class="text-center my-3">
    <b-popover :target="target" triggers="hover" :placement="placement" ref="popover">
      <template v-slot:title>
        <span v-html="title"></span>
      </template>
      <span v-html="content"></span>
    </b-popover>
  </div>
</template>

<script>
export default {
  name: 'Popover',
  data () {
    return {
      target: null,
      title: 'First step',
      content: 'This is my content',
      placement: 'top'
    }
  },
  async mounted () {
    const target = document.querySelector('.project-cards__item')
    await this.$set(this, 'target', target)
    this.$refs.popover.$emit('open')
  }
}
</script>
