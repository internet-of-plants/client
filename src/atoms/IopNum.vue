<template>
  <input
    v-model="model"
    type="number"
    :min="props.isUnsigned ? '0' : undefined"
    v-on:keypress="isNumber($event)"
    @paste="isNumber($event)"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  modelValue: number | null | ''
  isFloat?: boolean
  isUnsigned?: boolean
}>()

const isNumber = (event: KeyboardEvent | ClipboardEvent) => {
  const keysAllowed = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
  if (props.isFloat) {
    // TODO: handle localization and only accept one of those
    keysAllowed.push('.')
    keysAllowed.push(',')
  }
  // TODO: can clipboard data from other kinds be pasted here?
  const message =
    (event as KeyboardEvent).key ?? (event as ClipboardEvent).clipboardData?.getData('text') ?? ''

  for (const key of [...message]) {
    if (!keysAllowed.includes(key)) {
      event.preventDefault()
      break
    }
  }
}

const emit = defineEmits(['update:modelValue'])
const model = computed({
  get() {
    return props.modelValue === '' ? null : props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  }
})
</script>
