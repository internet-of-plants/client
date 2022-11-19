<template>
  <span>
    <span v-if="props.editing">
      <template
          v-if="[
            SensorWidgetKind.U8,
            SensorWidgetKind.U16,
            SensorWidgetKind.U32,
            SensorWidgetKind.U64,
            SensorWidgetKind.F32,
            SensorWidgetKind.F64,
          ].includes(props.widget.kind)"
      >
        <input :value="model" @blur="emit('update:modelValue', $event.target.value)" />
      </template>
      <template v-else-if="props.widget.kind === SensorWidgetKind.String">
        <input :value="model" @blur="emit('update:modelValue', $event.target.value)" />
      </template>
      <template v-else-if="props.widget.kind === SensorWidgetKind.Selection">
        <select v-model="model">
          <option value=""></option>
          <option
            v-for="opt in props.widget.data"
            :key="opt"
            :value="opt"
          >
            {{ opt }}
          </option>
        </select>
      </template>
      <template v-else-if="props.widget.kind === SensorWidgetKind.Moment">
        <Moment v-model="model" :editing="props.editing" />
      </template>
      <template v-else-if="props.widget.kind === SensorWidgetKind.Map">
        <span v-for="m in model" :key="m.key" class="flex">
          <SensorWidgets :editing="props.editing" :widget="widget.data[0]" v-model="m.key" class="map" />
          <SensorWidgets :editing="props.editing" :widget="widget.data[1]" v-model="m.value" />
        </span>
      </template>
    </span>
    <span v-else>
      <template
          v-if="[
            SensorWidgetKind.U8,
            SensorWidgetKind.U16,
            SensorWidgetKind.U32,
            SensorWidgetKind.U64,
            SensorWidgetKind.F32,
            SensorWidgetKind.F64,
            SensorWidgetKind.String,
            SensorWidgetKind.Selection,
          ].includes(props.widget.kind)"
      >
        <input v-model="model" />
      </template>
      <template v-else-if="props.widget.kind === SensorWidgetKind.Moment">
        <Moment v-model="model" :editing="props.editing" />
      </template>
      <template v-else-if="props.widget.kind === SensorWidgetKind.Map">
        <span v-for="m in model" :key="m.key" class="flex">
          <SensorWidgets :editing="props.editing" :widget="widget.data[0]" v-model="m.key" class="map" />
          <SensorWidgets :editing="props.editing" :widget="widget.data[1]" v-model="m.value" />
        </span>
      </template>
    </span>
  </span>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { SensorWidgetKind, DeviceWidgetKind } from "@/models";
import "vue3-colorpicker/style.css";
import Moment from '@/atoms/Moment.vue';
import { defineAsyncComponent } from 'vue'

const SensorWidgets = defineAsyncComponent(() =>
  import('@/atoms/SensorWidgets.vue')
)

const emit = defineEmits(["update:modelValue"]);

type Value = string | number | null | { key: Value; value: Value }[];

const props = defineProps<{
  editing: boolean;
  widget: DeviceWidgetKind;
  modelValue: Value;
}>();

const model = computed({
  get() {
    if (props.widget.kind === SensorWidgetKind.Map && props.modelValue === undefined) {
      emit("update:modelValue", { "key": null, "value": null });
    }
    return props.modelValue;
  },
  set(value) {
    emit("update:modelValue", value);
  }
})
</script>

<style lang="scss" scoped>
.map {
  padding-right: 5px;
}
</style>
