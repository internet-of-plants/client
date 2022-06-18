<template>
  <template
    v-if="
      props.ty.widget.kind === WidgetKind.U8 ||
        props.ty.widget.kind === WidgetKind.U16 ||
        props.ty.widget.kind === WidgetKind.U32 ||
        props.ty.widget.kind === WidgetKind.U64 ||
        props.ty.widget.kind === WidgetKind.F32 ||
        props.ty.widget.kind === WidgetKind.F64
    "
  >
    <input type="text" v-model.number="value" />
  </template>
  <template v-else-if="props.ty.widget.kind === WidgetKind.String">
    <input type="text" v-model.trim="value" />
  </template>
  <select v-else-if="props.ty.widget.kind === WidgetKind.Selection" v-model="value">
    <option v-for="value in props.ty.widget.data" :key="value">{{value}}</option>
  </select>
  <template v-else>
    ERROR
  </template>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { ConfigType, WidgetKind } from "@/models";

const props = defineProps<{
  ty: ConfigType;
  modelValue: string | number;
}>();

const emit = defineEmits(["update:modelValue"]);

const value = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit("update:modelValue", value);
  }
});
</script>
