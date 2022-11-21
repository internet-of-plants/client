<template>
  <span>
    <span v-if="props.editing" class="slot">
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
        <input :value="model" @blur="emit('update:modelValue', $event.target.value)" class="slot mb-2" />
      </template>
      <template v-else-if="props.widget.kind === SensorWidgetKind.String">
        <input :value="model" @blur="emit('update:modelValue', $event.target.value)" class="slot mb-2" />
      </template>
      <template v-else-if="props.widget.kind === SensorWidgetKind.Selection">
        <select v-model="model" class="slot mb-2">
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
        <Moment v-model="model" :editing="props.editing" class="slot mb-2" />
      </template>
      <template v-else-if="props.widget.kind === SensorWidgetKind.Map">
        <span v-for="(m, index) in model" :key="m.key" class="flex">
          <SensorWidgets :editing="props.editing" :widget="props.widget.data[0]" v-model="m.key" class="map" />
          <SensorWidgets :editing="props.editing" :widget="props.widget.data[1]" v-model="m.value" />
          <button class="ml-2 slot" @click="removeFromMap(index)">Delete</button>
        </span>
        <span v-if="props.widget.kind === SensorWidgetKind.Map" class="flex">
          <SensorWidgets :editing="props.editing" :widget="props.widget.data[0]" v-model="newElement" />
          <button class="ml-2 slot" @click="addToMap()">Insert</button>
          <span v-if="duplicatedKey" class="ml-2">Unable to add, key has already been set</span>
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
        <p class="slot mb-2">{{model}}</p>
      </template>
      <template v-else-if="props.widget.kind === SensorWidgetKind.Moment">
        <Moment v-model="model" :editing="props.editing" class="slot mb-2" />
      </template>
      <template v-else-if="props.widget.kind === SensorWidgetKind.Map">
        <span v-for="m in model" :key="m.key" class="flex">
          <SensorWidgets :editing="props.editing" :widget="props.widget.data[0]" v-model="m.key" class="map" />
          <SensorWidgets :editing="props.editing" :widget="props.widget.data[1]" v-model="m.value" />
        </span>
      </template>
    </span>
  </span>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { SensorWidgetKind, DeviceWidgetKind } from "@/models";
import "vue3-colorpicker/style.css";
import Moment from '@/atoms/Moment.vue';
import { defineAsyncComponent } from 'vue'

const SensorWidgets = defineAsyncComponent(() =>
  import('@/atoms/SensorWidgets.vue')
)

const newElement = ref(null);
const duplicatedKey = ref(false);

const emit = defineEmits(["update:modelValue"]);

type Value = string | number | null | { key: Value; value: Value }[];

const props = defineProps<{
  editing: boolean;
  widget: DeviceWidgetKind;
  modelValue: Value;
}>();

const model = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    duplicatedKey.value = Array.isArray(props.modelValue) && props.widget.kind === SensorWidgetKind.Map ? (props.modelValue.find((el) => el.key === newElement?.value) ?? false) : false;
    emit("update:modelValue", value);
  }
})

const addToMap = () => {
  duplicatedKey.value = model.value.find((el) => el.key === newElement?.value) ?? false;
  console.log(duplicatedKey.value)
  console.log(newElement.value)
  if (newElement.value !== null && !duplicatedKey.value) {
    model.value.push({ key: newElement.value, value: null });
  }
}

const removeFromMap = (index) => {
  model.value.splice(index, 1);
}
</script>

<style lang="scss" scoped>
.map {
  padding-right: 5px;
}
.slot {
  height: 23px;
}
select {
  background-color: #DFDFDF;
  border: solid 1px #626262;
  padding-left: 5px;
  border-radius: 3px;
}
button {
  background-color: #A3A3A3;
  border: solid 1px #626262;
  border-radius: 3px;
  height: calc(100% - 2px);
  padding-left: 4px;
  padding-right: 4px;
  color: #070707;
}
</style>