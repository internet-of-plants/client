<template>
  <span v-if="model" class="flex">
    <p v-if="!editing" :title="props.title" class="text-3xl text-center">
      {{ model }}
    </p>
    <input
      v-else-if="editing"
      v-model="model"
      :title="props.title"
      class="text-2xl text-center"
      type="text"
      @blur="emit('blur')"
    />

    <button class="right ml-2" @click="toggleEditing()">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-5 w-5"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
        <path
          fill-rule="evenodd"
          d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"
          clip-rule="evenodd"
        />
      </svg>
    </button>
  </span>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const props = defineProps<{
  modelValue: string | null
  title?: string
}>()

const editing = ref(false)

const emit = defineEmits(['blur', 'update:modelValue', 'toggle-edit'])

const model = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  }
})

const toggleEditing = () => {
  editing.value = !editing.value
  emit('toggle-edit', editing.value)
}
</script>
