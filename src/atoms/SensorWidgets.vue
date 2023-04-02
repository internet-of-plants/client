<template>
  <span>
    <span v-if="props.editing" class="slot">
      <template
          v-if="[
            SensorWidgetKind.Seconds,
            SensorWidgetKind.U8,
            SensorWidgetKind.U16,
            SensorWidgetKind.U32,
            SensorWidgetKind.U64,
          ].includes(props.widget.kind)"
      >
        <Num v-model="model" class="slot mb-2" size="5" />
      </template>
      <template
          v-else-if="[
            SensorWidgetKind.F32,
            SensorWidgetKind.F64,
          ].includes(props.widget.kind)"
      >
        <Num v-model="model" :is-float="true" class="slot mb-2" size="5" />
      </template>
      <template v-if="props.widget.kind === SensorWidgetKind.Seconds">
      seconds
      </template>
      <template v-else-if="props.widget.kind === SensorWidgetKind.Sensor">
        <select v-model="model" class="slot mb-2">
          <option value=""></option>
          <option
            v-for="opt in props.sensorsDisplay.filter((s) => s.prototypeId === props.widget.data)"
            :key="opt.localPk"
            :value="opt.localPk"
          >
            {{ opt.alias }}
          </option>
        </select>
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
          <span v-if="m.key !== undefined">
            <SensorWidgets
              v-model="m.key"
              :editing="false"
              :widget="props.widget.data[0]"
              :sensors-display="props.sensorsDisplay"
              :sensor-prototypes="props.sensorPrototypes"
              class="map"
            />
            <SensorWidgets
              v-model="m.value"
              :editing="props.editing"
              :widget="props.widget.data[1]"
              :sensors-display="props.sensorsDisplay"
              :sensor-prototypes="props.sensorPrototypes"
            />
            <button class="ml-2 slot" @click="removeFromMap(index)">Delete</button>
          </span>
        </span>
        <span v-if="props.widget.kind === SensorWidgetKind.Map" class="flex">
          <SensorWidgets
            v-model="newMapElement"
            :editing="props.editing"
            :widget="props.widget.data[0]"
            :sensors-display="props.sensorsDisplay"
            :sensor-prototypes="props.sensorPrototypes"
          />
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
            SensorWidgetKind.Selection,
          ].includes(props.widget.kind)"
      >
        <p class="slot mb-2">{{model}}</p>
      </template>
      <template v-else-if="props.widget.kind === SensorWidgetKind.Sensor">
        <p class="slot mb-2">{{props.sensorsDisplay.find((s) => s.localPk === model).alias}}</p>
      </template>
      <template v-else-if="props.widget.kind === SensorWidgetKind.Seconds">
        <p class="slot mb-2">{{model}} seconds</p>
      </template>
      <template v-else-if="props.widget.kind === SensorWidgetKind.Moment">
        <Moment v-model="model" :editing="props.editing" class="slot mb-2" />
      </template>
      <template v-else-if="props.widget.kind === SensorWidgetKind.Map">
        <span v-for="m in model" :key="m.key" class="flex">
          <SensorWidgets
            v-model="m.key"
            :editing="props.editing"
            :widget="props.widget.data[0]"
            :sensors-display="props.sensorsDisplay"
            :sensor-prototypes="props.sensorPrototypes"
            class="map"
          />
          <SensorWidgets
            v-model="m.value"
            :editing="props.editing"
            :widget="props.widget.data[1]"
            :sensors-display="props.sensorsDisplay"
            :sensor-prototypes="props.sensorPrototypes"
          />
        </span>
      </template>
    </span>
  </span>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { SensorWidgetKind, DeviceWidgetKind, SensorPrototype } from "@/models";
import "vue3-colorpicker/style.css";
import Moment from '@/atoms/Moment.vue';
import Num from "@/atoms/Num.vue";
import { defineAsyncComponent } from 'vue'

const SensorWidgets = defineAsyncComponent(() =>
  import('@/atoms/SensorWidgets.vue')
)

const newMapElement = ref(null);
const duplicatedKey = ref(false);

const emit = defineEmits(["update:modelValue"]);

type Value = string | number | null | { key: Value; value: Value }[] | { hours: number; minutes: number; seconds: number };

const props = defineProps<{
  editing: boolean;
  widget: DeviceWidgetKind;
  modelValue: Value;
  sensorsDisplay: {
    prototypeId: number;
    localPk: number;
    alias: string;
  };
  sensorPrototypes: SensorPrototype[];
}>();

const model = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit("update:modelValue", value);
  }
});

const addToMap = () => {
  duplicatedKey.value = !!model.value.find((el) => el.key === newMapElement?.value);
  if (newMapElement.value !== null && !duplicatedKey.value) {
    model.value.push({ key: newMapElement.value, value: null });
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
