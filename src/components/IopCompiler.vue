<template>
  <div v-if="compiler" class="flex flex-col items-center w-full">
    <CodeEditor v-model="compiler.latestCompilation.platformioIni" :disabled="true" />
    <CodeEditor v-model="compiler.latestCompilation.pinHpp" :disabled="true" />
    <CodeEditor v-model="compiler.latestCompilation.mainCpp" :disabled="true" />
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { computed, ref, watch } from 'vue'
import { useOrganizationStore } from '@/stores/organization'
import CodeEditor from '@/components/CodeEditor.vue'

const organizationStore = useOrganizationStore()
organizationStore.FETCH_ORGANIZATIONS()

const route = useRoute()

const compiler = computed(
  () =>
    organizationStore.organizations
      ?.flatMap((o) => {
        return o.collections.map((c) => c.compiler)
      })
      .find((c) => `${c?.id}` === route.params.compilerId) ?? null
)
</script>

<style scoped lang="scss"></style>
