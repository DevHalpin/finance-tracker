<template>
  <v-combobox
    :label="props.label"
    :items="props.options"
    item-title="label"
    item-value="value"
    :model-value="props.value"
    :disabled="props.disabled"
    :placeholder="props.placeholder"
    @update:model-value="onChange"
    @keydown.enter="handleEnter"
    variant="outlined"
    density="compact"
  />
</template>

<script setup lang="ts">

const props = defineProps<{
  onCreate?: (value: string) => void;
  options?: { label: string; value: string }[];
  value?: string | null;
  disabled?: boolean;
  placeholder?: string;
  label?: string;
}>();

const emit = defineEmits(['update:modelValue', 'create']);

const onChange = (value: string | null) => {
  emit('update:modelValue', value);
};

const handleEnter = (event: KeyboardEvent) => {
  const target = event.target as HTMLInputElement;
  if (target.value && props.onCreate) {
    props.onCreate(target.value);
    target.value = ''; 
  }
};
</script>