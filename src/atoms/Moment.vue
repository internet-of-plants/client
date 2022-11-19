<template>
  <span>
    <Datepicker v-if="props.editing" v-model="model" class="button" inputClassName="timePickerButtonMoment" enable-seconds auto-apply :close-on-auto-apply="false" timePicker />
    <span v-else>{{`${model.hours ?? 0}`.padStart(2, "0")}}:{{`${model.minutes ?? 0}`.padStart(2, "0")}}:{{`${model.seconds ?? 0}`.padStart(2, "0")}}</span>
  </span>
</template>

<script setup lang="ts">
import { computed } from "vue";
import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'

const props = defineProps<{
  modelValue: string | undefined;
  editing: boolean;
}>();

const emit = defineEmits(["update:modelValue"]);

const model = computed({
  get() {
    if (!props.modelValue) return { hours: null, minutes: null, seconds: null };
    const elements = props.modelValue.slice(0, props.modelValue.length - 1).slice("relay::Moment(".length).split(",").map((el) => el.trim());
    return { hours: elements[0], minutes: elements[1], seconds: elements[2] };
  },
  set(value) {
    emit("update:modelValue", `relay::Moment(${value?.hours ?? 0}, ${value?.minutes ?? 0}, ${value?.seconds ?? 0})`);
  }
})
</script>

<style lang="scss">
.timePickerButtonMoment {
  width: 105px;
  height: 20px;
  padding-left: 24px;
}
.dp__icon {
  padding: 5px;
}
</style>