<template>
  <div
    class="w-full h-full border-neutral-300 border-x p-2"
  >
    <div
      ref="editorMount"
      class="border border-neutral-300"
      @keyup.stop
      @keydown.stop
    />
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref, toRef, watch } from "vue";
import { basicSetup, EditorView } from "codemirror";
import { Compartment, EditorState } from "@codemirror/state";
import { keymap } from "@codemirror/view";
import { indentWithTab } from "@codemirror/commands";

const props = defineProps<{
  modelValue: string;
  disabled?: boolean;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", v: string): void;
  (e: "change", v: string): void;
}>();

const editorMount = ref();
let view: EditorView;

const modelValue = toRef(props, "modelValue", "");
const currentCode = ref<string>(modelValue.value ?? "");

watch(
  () => modelValue.value,
  async (currentMv) => {
    currentCode.value = currentMv ?? "";
    const currentDoc = view?.state.doc.toString();

    // We only care about this if the code changes from outside the editor itself
    // and we didn't just switch to a new doc. This condition prevents a cycle
    // with the updateListener
    if (currentDoc === currentCode.value || typeof view === "undefined") {
      return;
    }

    const updateTransaction = view.state.update({
      changes: {
        from: 0,
        to: view.state.doc.length,
        insert: currentCode.value,
      },
    });
    view.update([updateTransaction]);
  },
);

const language = new Compartment();
const readOnly = new Compartment();
const styleExtensionCompartment = new Compartment();

const styleExtension = computed(() => {
  const activeLineHighlight = "#e0dee9";
  return EditorView.theme({
    ".cm-scroller": { overflow: "auto" },
    ".cm-focused .cm-selectionBackground .cm-activeLine, .cm-selectionBackground, .cm-content .cm-activeLine ::selection":
      { backgroundColor: `${activeLineHighlight} !important` },
  });
});

const mountEditor = async () => {
  currentCode.value = modelValue.value ?? "";
  const updateListener = EditorView.updateListener.of((update) => {
    if (!update.docChanged) return;
    const updatedCode = update.view.state.doc.toString();
    emit("update:modelValue", updatedCode);
    emit("change", updatedCode);
  });

  const extensions = [basicSetup];

  const editorState = EditorState.create({
    doc: currentCode.value,
    extensions: extensions.concat([
      keymap.of([indentWithTab]),
      styleExtensionCompartment.of(styleExtension.value),
      readOnly.of(EditorState.readOnly.of(props.disabled)),
      updateListener,
      EditorView.lineWrapping,
    ]),
  });

  view = new EditorView({
    state: editorState,
    parent: editorMount.value,
  });
};

onMounted(() => {
  if (editorMount.value) {
    mountEditor();
  }
});
</script>

<style>
.cm-editor .cm-content {
  font-size: 14px;
}

.cm-editor .cm-gutter {
  font-size: 14px;
}
</style>
