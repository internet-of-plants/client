<template>
  <Datepicker
    v-if="props.editing"
    ref="picker"
    v-model="model"
    inputClassName="timePickerButtonMoment"
    :clearable="false"
    enable-seconds
    auto-apply
    :close-on-auto-apply="false"
    timePicker
  />
  <span v-else
    >{{ `${model.hours ?? 0}`.padStart(2, '0') }}h:{{
      `${model.minutes ?? 0}`.padStart(2, '0')
    }}m:{{ `${model.seconds ?? 0}`.padStart(2, '0') }}s</span
  >
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import Datepicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'

const props = defineProps<{
  modelValue: { hours: number; minutes: number; seconds: number } | null
  editing: boolean
}>()

const picker = ref(null)
const emit = defineEmits(['update:modelValue'])

const model = computed({
  get() {
    if (!props.modelValue) {
      emit('update:modelValue', { hours: 0, minutes: 0, seconds: 0 })
      return { hours: 0, minutes: 0, seconds: 0 }
    }
    const { hours, minutes, seconds } = props.modelValue
    return { hours, minutes, seconds }
  },
  set(value) {
    emit('update:modelValue', {
      hours: value?.hours ?? 0,
      minutes: value?.minutes ?? 0,
      seconds: value?.seconds ?? 0
    })
  }
})
</script>

<style lang="scss">
.timePickerButtonMoment {
  height: 100%;
  padding-left: 24px;
  background-color: inherit;
  border: solid 1px #626262;
  color: inherit;
}
.dp__input_wrap,
.dp__input_wrap,
.dp__main > div {
  width: 96px;
  height: 100%;
}
.dp__icon {
  padding-left: 5px;
  padding-right: 5px;
}
</style>
