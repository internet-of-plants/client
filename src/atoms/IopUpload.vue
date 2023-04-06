<template>
  <span class="box">
    <span>
      <div class="mb-1 mt-2">
        <slot name="description"></slot>
      </div>

      <h3 v-if="!props.collection.compiler">
        <i>
          <p class="text-center">{{ props.deviceId ? 'Device' : 'Collection' }} not configured</p>
          <p class="text-center">
            {{ !props.editing ? 'Enable edit mode and c' : 'C' }}onfigure the integrations
          </p>
        </i>
      </h3>

      <span v-if="targets" class="mt-2">
        <span class="text-lg mr-1" v-if="customizeCompiler || target">Device:</span>
        <select v-if="customizeCompiler" v-model="targetId" @change="updateTargetEvent">
          <option value=""></option>
          <option v-for="target in targets" :key="target.id" :value="target.id" class="text-sm">
            {{ targetName(target) }}
          </option>
        </select>
        <span v-else-if="target" class="text-sm">
          {{ targetName(target) }}
        </span>
      </span>

      <div v-if="compilers && compilers.length > 0" class="mt-2">
        <span v-if="props.editing">{{ compiler ? '' : 'Inherit ' }}Configurations From:</span>
        <select v-if="props.editing" v-model="compilerId" class="ml-2">
          <option v-if="compiler && compiler.devicesCount > 1" value="">new</option>
          <option v-for="c in compilers" :key="c.id" :value="c.id">{{ c.collectionName }}</option>
        </select>
        <span v-else-if="compiler">Collection: {{ compiler.collectionName }}</span>
      </div>

      <div v-if="target && deviceConfigs" class="mt-2">
        <span class="text-lg">Configurations:</span>
        <div class="flex flex-row text-sm">
          <div class="flex flex-col">
            <span v-for="request in target.configurationRequests" :key="request.id">
              {{ request.humanName }}:
            </span>
          </div>

          <div class="flex flex-col ml-2">
            <div v-for="request in target.configurationRequests" :key="request.id" class="h-full">
              <span v-if="customizeCompiler">
                <template v-if="request.ty.widget === DeviceWidgetKind.SSID">
                  <input v-model="deviceConfigs[request.id]" />
                </template>
                <template v-if="request.ty.widget === DeviceWidgetKind.PSK">
                  <input v-model="deviceConfigs[request.id]" />
                </template>
                <template v-if="request.ty.widget === DeviceWidgetKind.Timezone">
                  <select v-model="deviceConfigs[request.id]">
                    <option value=""></option>
                    <option v-for="index in 24" :key="index - 12" :value="`${index - 12}`">
                      UTC{{ index > 12 ? '+' : '' }}{{ index === 12 ? '' : index - 12 }}
                    </option>
                  </select>
                </template>
              </span>
              <span v-else-if="request.ty.widget === DeviceWidgetKind.Timezone"
                >UTC{{ deviceConfigs[request.id] > '0' ? '+' : ''
                }}{{ deviceConfigs[request.id] }}</span
              >
              <span v-else>{{ deviceConfigs[request.id] }}</span>
            </div>
          </div>
        </div>
      </div>

      <div v-if="target" class="mt-2">
        <p class="text-xl">Integrations:</p>
        <p
          v-if="
            !customizeCompiler &&
            alignedSensors.length === 1 &&
            alignedSensors[0][1].sensorId === null
          "
        >
          No integrations configured
        </p>

        <div v-else class="flex flex-row">
          <!-- Created Sensor Color -->
          <div class="flex flex-col">
            <span
              v-for="([index, sensor], i) in alignedSensors"
              :key="`${i}-${index}`"
              @click.capture="colorCapture($event, sensor)"
            >
              <div v-if="sensor.color" class="mb-2 slot color-picker">
                <ColorPicker
                  v-model:pure-color="sensor.color"
                  @update:pure-color="saveColor($event, sensor.sensorId!)"
                />
              </div>
              <div v-else class="mb-2 slot"></div>
            </span>
          </div>

          <!-- Sensors Select -->
          <div class="flex flex-col">
            <span
              v-for="([index, sensor], i) in alignedSensors"
              :key="`${i}-${index}`"
              class="mb-2 slot"
            >
              <select
                v-if="
                  customizeCompiler &&
                  (sensor.prototypeId !== '' || i === alignedSensors.length - 1)
                "
                v-model="sensor.prototypeId"
                @change="addSensorEvent"
                class="mr-5 slot"
              >
                <template v-if="sensorPrototypes && targetId">
                  <option value=""></option>
                  <option
                    v-for="prototype in sensorPrototypes"
                    :key="prototype.id"
                    :value="prototype.id"
                  >
                    {{ prototype.name }}
                  </option>
                </template>
              </select>
              <span v-else class="mr-5">
                {{ sensorPrototype(sensor.prototypeId)?.name }}
              </span>
            </span>
          </div>

          <!-- Alias -->
          <div class="flex flex-col">
            <span
              v-for="([index, sensor], i) in alignedSensors"
              :key="`${i}-${index}`"
              class="mb-2 slot"
            >
              <input
                v-if="customizeCompiler && sensor.alias !== null && sensor.sensorId !== null"
                v-model="sensor.alias"
                @blur="saveAlias(sensor.alias!, sensor.sensorId!)"
                class="mr-5"
              />
              <span v-else-if="sensor.alias !== null" class="mr-5">
                {{ sensor.alias }}
              </span>
            </span>
          </div>

          <!-- Requests Names -->
          <span class="flex flex-col">
            <span
              v-for="[index, request] in alignedSensorConfigRequestNames"
              :key="`${index}-${request.id}`"
              class="mb-2 mr-2 slot"
            >
              <span v-if="request.id !== null">{{ request?.humanName }}</span>
              <span v-else></span>
            </span>
          </span>

          <!-- Requests Values -->
          <span class="flex flex-col ml-2">
            <span
              v-for="[index, request] in alignedSensorConfigRequestValues"
              :key="`${index}-${request.id}`"
            >
              <SensorWidgets
                v-if="request.id !== null && request.ty !== null && sensorPrototypes"
                v-model="sensorConfigs[`${index}-${request.id}`]"
                :editing="customizeCompiler"
                :widget="request.ty.widget"
                :sensors-display="sensorsDisplay"
                :sensor-prototypes="sensorPrototypes"
              />
              <span v-else></span>
            </span>
          </span>
        </div>
      </div>
    </span>

    <span
      v-if="customizeCompiler || (props.editing && compilerId !== props.collection.compiler?.id)"
      class="flex justify-center pt-3"
    >
      <button v-if="!loading" @click="create()">Save</button>
      <svg
        v-else
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="w-6 h-6 loading"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
        />
      </svg>
    </span>
  </span>
</template>

<script setup lang="ts">
import { onMounted, ref, computed, watch } from 'vue'
import type {
  Collection,
  Target,
  Config,
  Sensor,
  Compiler,
  SensorPrototype,
  Val,
  ConfigRequest
} from '@/models'
import { SensorWidgetKind, DeviceWidgetKind } from '@/models'
import SensorWidgets from '@/atoms/SensorWidgets.vue'
import TargetService from '@/api/target'
import CompilerService from '@/api/compiler'
import type { NewCompiler } from '@/api/compiler'
import SensorPrototypeService from '@/api/sensor_prototype'
import SensorService from '@/api/sensor'
import { ColorPicker } from 'vue3-colorpicker'
import 'vue3-colorpicker/style.css'

const props = defineProps<{
  organizationId: number
  collection: Collection
  deviceId?: number
  editing: boolean
}>()

const emit = defineEmits(['refresh'])

const loading = ref(false)
const targets = ref<Target[] | null>(null)
const compilers = ref<Compiler[] | null>(null)
const sensorPrototypes = ref<SensorPrototype[] | null>(null)
const compilerId = ref<number | ''>('')

const compiler = computed(() => {
  return compilers.value?.find((c) => c.id === compilerId.value)
})

const customizeCompiler = computed(() => {
  return props.editing && (compiler.value?.devicesCount === 1 || compilerId.value === '')
})

const targetId = ref(props.collection.compiler?.target.id)

const target = computed(() => {
  return targets.value?.find((t) => t.id === targetId.value)
})

const sensorPrototype = (id: number | '') => {
  return sensorPrototypes.value?.find((s) => s.id === id)
}

const sensor = (sensorId: number) => {
  return compiler.value?.sensors.find((s) => s.id === sensorId)
}

function randomString(size: number) {
  let output = ''
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  for (let i = 0; i < size; ++i) {
    output += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return output
}

function colorCapture(event: Event, sensor: SensorDisplay) {
  if (!customizeCompiler && sensor.color === null) {
    event.preventDefault()
    event.stopPropagation()
  }
}

function defaultValue(widget: DeviceWidgetKind): string {
  switch (widget) {
    case DeviceWidgetKind.SSID:
      return `iop-${randomString(10)}`
    case DeviceWidgetKind.PSK:
      return randomString(20)
    case DeviceWidgetKind.Timezone:
      return `${(-1 * new Date().getTimezoneOffset()) / 60}`
    default:
      throw new Error(`Invalid widget: ${widget}`)
  }
}

function randomPk() {
  return Math.floor(Math.random() * 50000)
}

function buildSensorsDisplay(): SensorDisplay[] {
  const sortedSensors = compiler.value?.sensors ?? []
  sortedSensors.sort((a, b) => a.index - b.index)
  const list: SensorDisplay[] = sortedSensors.map((s) => ({
    localPk: randomPk(),
    prototypeId: s.prototype.id,
    alias: s.alias,
    color: s.color,
    sensorId: s.id
  }))
  list.push({
    localPk: randomPk(),
    prototypeId: '',
    alias: null,
    color: null,
    sensorId: null
  })
  return list
}

function buildDeviceConfigs(): Record<number, string> {
  const values = compiler.value?.deviceConfigs.reduce(
    (acc, val) => ({
      ...acc,
      [val.requestId]: val.value
    }),
    {}
  )
  if (compilers.value && values === undefined) {
    return (
      target.value?.configurationRequests.reduce(
        (acc, val) => ({
          ...acc,
          [val.id]: defaultValue(val.ty.widget)
        }),
        {}
      ) ?? {}
    )
  }
  return values ?? {}
}

interface SensorDisplay {
  localPk: number
  prototypeId: number | ''
  alias: string | null
  color: string | null
  sensorId: number | null
}

const sensorsDisplay = ref<SensorDisplay[]>([])
const sensorConfigs = ref<Record<string, Val | null>>({})
const deviceConfigs = ref<Record<number, string>>({})

const alignedSensors = computed<[number, SensorDisplay][]>(() => {
  return Object.entries(sensorsDisplay.value).flatMap(([index, sensor]) => {
    const prototype = sensorPrototype(sensor.prototypeId)

    const requests: SensorDisplay[] =
      prototype?.configurationRequests.map(() => ({
        localPk: randomPk(),
        prototypeId: '',
        alias: null,
        color: null,
        sensorId: null
      })) ?? []

    for (const request of prototype?.configurationRequests ?? []) {
      // For each line of the array/map we have to add a blank line for the sensor names
      // Otherwise things get misaligned
      // We ignore one element if not editing the compiler, because that's the "add element" button
      const element = sensorConfigs.value[`${index}-${request.id}`]
      if (Array.isArray(element)) {
        element.slice(Number(!customizeCompiler.value)).forEach(() => {
          requests.push({
            prototypeId: '',
            alias: null,
            color: null,
            sensorId: null,
            localPk: randomPk()
          })
        })
      }
    }
    requests[0] = sensor as SensorDisplay
    return requests.map((request) => [index as unknown, request]) as [number, SensorDisplay][]
  })
})

const alignedSensorConfigRequestNames = computed<[number, ConfigRequest | { id: null }][]>(() => {
  return Object.entries(sensorsDisplay.value).flatMap(([index, sensor]) => {
    const prototype = sensorPrototype(sensor.prototypeId);

    const requests = []
    for (const request of prototype?.configurationRequests ?? []) {
      requests.push(request);

      // For each line of the array/map we have to add a blank line for the request names
      // Otherwise things get misaligned
      // We ignore one element if not editing the compiler, because that's the "add element" button
      const element = sensorConfigs.value[`${index}-${request.id}`]
      if (Array.isArray(element)) {
        element.slice(Number(!customizeCompiler.value)).forEach(() => {
          requests.push({
            id: null
          });
        });
      }
    }
    return requests.map((request) => [index as unknown, request]) as [
      number,
      ConfigRequest | { id: null }
    ][]
  })
})

const alignedSensorConfigRequestValues = computed<[number, ConfigRequest][]>(() => {
  return Object.entries(sensorsDisplay.value).flatMap(([index, sensor]) => {
    const prototype = sensorPrototype(sensor.prototypeId);
    const requests = [];
    for (const request of prototype?.configurationRequests ?? []) {
      requests.push(request);
    }
    return requests.map((request) => [index as unknown as number, request]) as [
      number,
      ConfigRequest
    ][]
  })
})

const removeEmptySensors = () => {
  const toRemove = sensorsDisplay.value
    .filter((s) => s.prototypeId === '')
    .map((el, index) => index)

  if (toRemove.length > 0) {
    const configs = { ...sensorConfigs.value }
    for (const [key, value] of Object.entries(configs)) {
      const index = Number(key.split('-')[0])
      const id = Number(key.split('-')[1])

      delete sensorConfigs.value[`${index}-${id}`]

      if (!toRemove.find((i) => i === index)) {
        const count = toRemove.reduce((acc, i) => (i < index ? acc + 1 : acc), 0)
        sensorConfigs.value[`${index - count}-${id}`] = value
      }
    }
  }

  sensorsDisplay.value = sensorsDisplay.value.filter((s) => {
    return s.prototypeId !== ''
  })

  if (sensorsDisplay.value.length === 0) {
    sensorsDisplay.value.push({
      localPk: randomPk(),
      prototypeId: '',
      alias: null,
      color: null,
      sensorId: null
    })
  }
}

const addSensor = (id: number) => {
  const sensor = sensorPrototype(id)
  if (sensor) {
    sensorsDisplay.value[sensorsDisplay.value.length - 1].alias = sensor.name

    // Cleanup sensorConfigs if sensor changed
    for (const request of sensor.configurationRequests) {
      const key: string = `${sensorsDisplay.value.length - 1}-${request.id}`
      if (!sensorConfigs.value[key]) {
        if (request.ty.widget.kind === SensorWidgetKind.Map) {
          sensorConfigs.value[key] = []
        } else {
          sensorConfigs.value[key] = null
        }
      }
    }
  }

  removeEmptySensors()
  sensorsDisplay.value.push({
    localPk: randomPk(),
    prototypeId: '',
    alias: null,
    color: null,
    sensorId: null
  } as SensorDisplay)
}

const addSensorEvent = (ev: Event) => {
  addSensor(Number((ev.target as HTMLInputElement).value))
}

const create = async () => {
  loading.value = true

  if (compilerId.value !== '' && compilerId.value !== props.collection.compiler?.id) {
    if (!props.deviceId) {
      await CompilerService.set({
        compilerId: compilerId.value,
        collectionId: props.collection.id
      })
    } else {
      await CompilerService.set({
        compilerId: compilerId.value,
        deviceId: props.deviceId
      })
    }
  } else {
    if (!target.value) {
      loading.value = false
      throw new Error('missing target')
    }

    const newCompiler: NewCompiler = {
      targetId: target.value.id,
      sensors: [],
      deviceConfigs: [],
      deviceId: props.deviceId ?? null,
      collectionId: props.collection.id
    }

    for (const request of target.value.configurationRequests) {
      if ((deviceConfigs.value[request.id] ?? '') === '') {
        loading.value = false
        throw new Error(`missing config for ${request.name}`)
      }

      const value = deviceConfigs.value[request.id]
      switch (request.ty.widget) {
        case DeviceWidgetKind.SSID:
          if (value.length > 32) {
            loading.value = false
            throw new Error(`SSID is too long: ${value}, max length is 32`)
          }
          break
        case DeviceWidgetKind.PSK:
          if (value.length > 64) {
            loading.value = false
            throw new Error(`PSK is too long: ${value}, max length is 64`)
          }
          break
      }

      newCompiler.deviceConfigs.push({
        requestId: request.id,
        value
      })
    }

    for (const [index, sensor] of Object.entries(sensorsDisplay.value)) {
      if (sensor.prototypeId === '') continue

      if (!sensorPrototype(sensor.prototypeId)) {
        loading.value = false
        throw new Error(`invalid sensor configured: ${sensor.prototypeId}`)
      }

      const configs = []
      for (const request of sensorPrototype(sensor.prototypeId)?.configurationRequests ?? []) {
        const value = sensorConfigs.value[`${index}-${request.id}`]
        if (!value) {
          loading.value = false
          throw new Error(`missing config for ${request.name}`)
        }

        configs.push({
          requestId: request.id,
          value
        })
      }

      const alias = sensor.alias
      if (!alias) {
        loading.value = false
        throw new Error(`missing alias for ${JSON.stringify(sensor)}`)
      }

      newCompiler.sensors.push({
        localPk: sensor.localPk,
        prototypeId: sensor.prototypeId,
        alias,
        configs
      })
    }
    await CompilerService.create(newCompiler)
  }

  loading.value = false
  emit('refresh')
}

async function fetchCompilers(id: number) {
  if (!id) {
    compilers.value = []
  } else {
    compilers.value = await CompilerService.list({
      targetId: id,
      organizationId: props.organizationId
    })
  }
  targetId.value = id
}

async function fetchSensorPrototypes(targetId: number) {
  sensorPrototypes.value = []
  sensorPrototypes.value = await SensorPrototypeService.listForTarget(targetId)

  if (!compiler.value) throw new Error("no compiler set");

  sensorConfigs.value =
    compiler.value.sensors
      .flatMap(
        (sensor: Sensor) =>
          sensor.configurations.map((c: Config) => [sensor, c]) as [Sensor, Config][]
      )
      .map(([sensor, config]: [Sensor, Config]) => {
        if (config.request.ty.widget.kind === SensorWidgetKind.Sensor) {
          const localSensor = sensorsDisplay.value.find((s) => s.sensorId === (config.value as { sensorId: number }).sensorId)
          if (!localSensor) throw new Error(`unable to find sensor ${config.value}`)
          config.value = localSensor.localPk
        }
        return { [`${sensor.index}-${config.request.id}`]: config.value }
      })
      .reduce((acc, curr) => ({ ...acc, ...curr }), {});
}

const saveColor = async (color: string | null, sensorId?: number) => {
  if (!color || !sensorId) return
  if (sensor(sensorId)?.color === color) return

  await SensorService.setColor({
    sensorId,
    collectionId: props.collection.id,
    color
  })

  emit('refresh')
}

const targetName = (target: Target) => {
  if (!target) return ''

  return `${target.arch}${target.board ? '-' + target.board : ''}${
    target.name ? '-' + target.name : ''
  }`
}

const saveAlias = async (alias: string, sensorId?: number) => {
  if (!sensorId) return
  if (sensor(sensorId)?.alias === alias) return

  await SensorService.setAlias({
    sensorId,
    collectionId: props.collection.id,
    alias
  })

  emit('refresh')
}

const updateTarget = async (id: number | undefined) => {
  if (!id) return
  await fetchCompilers(id)

  sensorsDisplay.value = buildSensorsDisplay()
  await fetchSensorPrototypes(id)

  deviceConfigs.value = buildDeviceConfigs()
}

const updateTargetEvent = async (event: Event) => {
  const value = (event.target as HTMLInputElement).value
  updateTarget(parseInt(value))
}

const load = async () => {
  targets.value = await TargetService.list()
  targetId.value = props.collection.compiler?.target.id
  compilerId.value = props.collection.compiler?.id ?? ''
}

watch(() => props.collection, load)
onMounted(load)

watch(compilerId, async () => {
  if (!compiler.value) {
    await updateTarget(props.collection.compiler?.target.id)
  } else {
    await updateTarget(compiler.value?.target.id)
  }
})
</script>

<style lang="scss" scoped>
.slot {
  height: 23px;
}
.box {
  border: solid 1px #626262;
  padding: 25px;
}
button {
  background-color: #a3a3a3;
  border: solid 1px #626262;
  border-radius: 3px;
  padding-left: 4px;
  padding-right: 4px;
  color: #070707;
}
input {
  background-color: #dfdfdf;
  border: solid 1px #626262;
  border-radius: 3px;
  padding-left: 5px;
  height: calc(100% - 2px);
}
select {
  background-color: #dfdfdf;
  border: solid 1px #626262;
  border-radius: 3px;
  padding-left: 5px;
}
.color-picker {
  width: 37px;
}
</style>
<style lang="scss">
.current-color,
.vc-color-wrap {
  width: 28px !important;
}
.vc-color-wrap {
  border: solid 1px #626262;
  border-radius: 3px;
  width: 100%;
  height: 26.5px !important;
}
.loading {
  animation: rotation 2s infinite linear;
}
@keyframes rotation {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(359deg);
  }
}
</style>
