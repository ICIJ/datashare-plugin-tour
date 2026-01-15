<script setup>
import IPhShootingStar from '~icons/ph/shooting-star'
import img from '@/assets/tour-modal-light.svg'
import imgDark from '@/assets/tour-modal-dark.svg'
import { useCoreComponent } from '@/composables/useCoreComponent'

const AppModal = await useCoreComponent('AppModal/AppModal')
const ButtonIcon = await useCoreComponent('Button/ButtonIcon')
const ImageMode = await useCoreComponent('ImageMode/ImageMode')
const ImageModeSource = await useCoreComponent('ImageMode/ImageModeSource')
</script>

<template>
  <app-modal title="Discover Datashare's main features" no-header-close>
    <image-mode class="d-block text-center">
      <image-mode-source :src="img" />
      <image-mode-source :src="imgDark" color-mode="dark" />
    </image-mode>
    <template #footer="{ cancel, ok }">
      <div class="d-flex justify-content-between w-100">
        <button-icon variant="outline-secondary" @click="cancel">Skip tour</button-icon>
        <button-icon variant="action" :icon-right="IPhShootingStar" @click="ok">Start</button-icon>
      </div>
    </template>
  </app-modal>
</template>
