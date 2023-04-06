<template>
  <span>
    <span v-if="props.editing" class="slot">
      <template
        v-if="
          [
            SensorWidgetKind.Seconds,
            SensorWidgetKind.U8,
            SensorWidgetKind.U16,
            SensorWidgetKind.U32,
            SensorWidgetKind.U64
          ].includes(props.widget.kind)
        "
      >
        <Num v-model="numModel" :is-unsigned="true" class="slot mb-2" size="5" />
      </template>
      <template
        v-else-if="[SensorWidgetKind.F32, SensorWidgetKind.F64].includes(props.widget.kind)"
      >
        <Num v-model="numModel" :is-float="true" class="slot mb-2" size="5" />
      </template>
      <template v-if="props.widget.kind === SensorWidgetKind.Seconds"> second{{ (model && model > 1) ? "s" : "" }}</template>
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
          <option v-for="opt in props.widget.data" :key="opt" :value="opt">
            {{ opt }}
          </option>
        </select>
      </template>
      <template v-else-if="props.widget.kind === SensorWidgetKind.Moment">
        <Moment
          v-model="momentModel"
          :editing="props.editing"
          class="slot mb-2"
        />
      </template>
      <template v-else-if="props.widget.kind === SensorWidgetKind.Map">
        <span v-for="(m, index) in model" :key="JSON.stringify((m as MapElement).key)" class="flex">
          <span v-if="(m as MapElement).key">
            <SensorWidgets
              v-model="(m as MapElement).key"
              :editing="false"
              :widget="props.widget.data[0]"
              :sensors-display="props.sensorsDisplay"
              :sensor-prototypes="props.sensorPrototypes"
              class="map"
            />
            <SensorWidgets
              v-model="(m as MapElement).value"
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
        v-if="
          [
            SensorWidgetKind.U8,
            SensorWidgetKind.U16,
            SensorWidgetKind.U32,
            SensorWidgetKind.U64,
            SensorWidgetKind.F32,
            SensorWidgetKind.F64,
            SensorWidgetKind.Selection
          ].includes(props.widget.kind)
        "
      >
        <p class="slot mb-2">{{ model }}</p>
      </template>
      <template v-else-if="props.widget.kind === SensorWidgetKind.Sensor">
        <p class="slot mb-2">{{ props.sensorsDisplay.find((s) => s.localPk === model)?.alias }}</p>
      </template>
      <template v-else-if="props.widget.kind === SensorWidgetKind.Seconds">
        <p class="slot mb-2">{{ model }} second{{ (model && model > 1) ? "s" : "" }}</p>
      </template>
      <template v-else-if="props.widget.kind === SensorWidgetKind.Moment">
        <Moment
          v-model="momentModel"
          :editing="props.editing"
          class="slot mb-2"
        />
      </template>
      <template v-else-if="props.widget.kind === SensorWidgetKind.Map">
        <span v-for="m in model" :key="JSON.stringify((m as MapElement).key)" class="flex">
          <SensorWidgets
            v-model="(m as MapElement).key"
            :editing="props.editing"
            :widget="props.widget.data[0]"
            :sensors-display="props.sensorsDisplay"
            :sensor-prototypes="props.sensorPrototypes"
            class="map"
          />
          <SensorWidgets
            v-model="(m as MapElement).value"
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
import { computed, ref } from 'vue'
import type { ConfigType, SensorPrototype, Val } from '@/models'
import { SensorWidgetKind } from '@/models'
import 'vue3-colorpicker/style.css'
import Moment from '@/atoms/IopMoment.vue'
import Num from '@/atoms/IopNum.vue'
import { defineAsyncComponent } from 'vue'

export interface MomentElement {
  hours: number
  minutes: number
  seconds: number
}

interface MapElement {
  key: Val
  value: Val | null
}

const SensorWidgets = defineAsyncComponent(() => import('@/atoms/SensorWidgets.vue'))

const newMapElement = ref(null)
const duplicatedKey = ref(false)

const emit = defineEmits(['update:modelValue'])

const props = defineProps<{
  editing: boolean
  widget: ConfigType['widget']
  modelValue: Val | null
  sensorsDisplay: {
    prototypeId: number | ''
    localPk: number
    alias: string | null
  }[]
  sensorPrototypes: SensorPrototype[]
}>()

const model = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit('update:modelValue', value)
  }
});

const numModel = computed({
  get() {
    return props.modelValue as number | null;
  },
  set(value) {
    emit('update:modelValue', value)
  }
});

const momentModel = computed({
  get() {
    return props.modelValue as MomentElement | null;
  },
  set(value) {
    emit('update:modelValue', value)
  }
});
const addToMap = () => {
  if (!Array.isArray(model.value)) {
    throw new Error(
      `unable to add elements to something that is not an Array: ${JSON.stringify(model.value)}`
    )
  }

  duplicatedKey.value = model.value.some((el) => el.key === newMapElement?.value)
  if (newMapElement.value !== null && !duplicatedKey.value) {
    ;(model.value as MapElement[]).push({ key: newMapElement.value, value: null })
  }
}

const removeFromMap = (index: unknown) => {
  if (!Array.isArray(model.value)) {
    throw new Error(
      `unable to add elements to something that is not an Array: ${JSON.stringify(model.value)}`
    )
  }

  model.value.splice(index as number, 1)
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
  background-color: #dfdfdf;
  border: solid 1px #626262;
  padding-left: 5px;
  border-radius: 3px;
}
button {
  background-color: #a3a3a3;
  border: solid 1px #626262;
  border-radius: 3px;
  height: calc(100% - 2px);
  padding-left: 4px;
  padding-right: 4px;
  color: #070707;
}
</style>
