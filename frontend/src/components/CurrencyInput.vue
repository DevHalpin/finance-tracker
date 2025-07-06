<template>
  <div>
    <v-text-field
      ref="inputRef"
      :model-value="formattedValue"
      @input="handleInput"
      @blur="handleBlur"
      v-bind="$attrs"
      variant="outlined"
      density="comfortable"
      :hint="hintMessage"
      persistent-hint
    >
      <template #prepend-inner>
        <v-btn icon variant="text" @click="toggleSign" size="small" :color="buttonColor">
          <component :is="signIcon" />
        </v-btn>
      </template>
    </v-text-field>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, computed } from 'vue';
import { PlusCircle, MinusCircle } from 'lucide-vue-next';

const props = defineProps({
  modelValue: {
    type: [String, Number],
  },
});

const emit = defineEmits(['update:modelValue']);

const inputRef = ref<HTMLInputElement | null>(null);
const formattedValue = ref('');
const numericValue = ref<number | null>(null);

const isIncome = computed(() => numericValue.value !== null && numericValue.value > 0);
const isExpense = computed(() => numericValue.value !== null && numericValue.value < 0);

const signIcon = computed(() => (isIncome.value ? PlusCircle : MinusCircle));

const hintMessage = computed(() => {
  if (isIncome.value) return 'This will count as income';
  if (isExpense.value) return 'This will count as an expense';
  return '';
});

const buttonColor = computed(() => {
  if (isIncome.value) {
    return 'success';
  }
  if (isExpense.value) {
    return 'error';
  }
  return undefined;
});

const toggleSign = () => {
  if (numericValue.value !== null) {
    numericValue.value = -numericValue.value;
    formattedValue.value = formatCurrency(numericValue.value);
    emit('update:modelValue', numericValue.value.toString());
  }
};

const formatCurrency = (value: number | null) => {
  if (value === null) return '';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value);
};

const parseCurrency = (value: string) => {
  const number = Number(value.replace(/[^0-9.-]+/g, ''));
  return isNaN(number) ? null : number;
};

const handleInput = (event: Event) => {
  const input = event.target as HTMLInputElement;
  const value = input.value;
  numericValue.value = parseCurrency(value);
  formattedValue.value = value;
};

const handleBlur = () => {
  if (numericValue.value !== null) {
    formattedValue.value = formatCurrency(numericValue.value);
    emit('update:modelValue', numericValue.value.toString());
  } else {
    formattedValue.value = '';
    emit('update:modelValue', '');
  }
};

watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue === null || newValue === undefined || newValue === '') {
      numericValue.value = null;
      formattedValue.value = '';
    } else {
      const newNumericValue = Number(newValue);
      if (!isNaN(newNumericValue) && newNumericValue !== numericValue.value) {
        numericValue.value = newNumericValue;
        formattedValue.value = formatCurrency(newNumericValue);
      }
    }
  },
  { immediate: true }
);
</script>