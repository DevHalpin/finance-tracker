<template>
  <v-menu v-model="menu" :close-on-content-click="false" location="bottom">
    <template v-slot:activator="{ props }">
      <v-text-field
        :model-value="formattedDate"
        :label="label"
        readonly
        v-bind="props"
        variant="outlined"
        density="comfortable"
      ></v-text-field>
    </template>
    <v-date-picker :model-value="dateValue" @update:model-value="updateDate"></v-date-picker>
  </v-menu>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import { format } from 'date-fns';

const props = defineProps<{
  modelValue: string;
  label: string;
}>();

const emit = defineEmits(['update:modelValue']);

const menu = ref(false);

const formattedDate = computed(() => {
  return props.modelValue ? format(new Date(props.modelValue), 'PPP') : '';
});

const dateValue = computed(() => {
  return props.modelValue ? new Date(props.modelValue) : new Date();
});

const updateDate = (date: Date) => {
  menu.value = false;
  emit('update:modelValue', format(date, 'yyyy-MM-dd'));
};
</script>